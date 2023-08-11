import { forEach } from 'lodash';
import { AlchemyService } from './alchemy_service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OwnedNft } from 'alchemy-sdk';

@Injectable()
export class NFTService {

    constructor(private readonly alchemyService: AlchemyService, 
                private readonly configService: ConfigService){}

    async isTokenIdFromWallet(contract:string, tokenId: number, walletAddress: string): Promise<boolean>{
        let NFTOwnedByWallet = false;
        const owners = await this.getOwnersForTokenAndContract(contract, tokenId);

        const lowercaseOwners = owners.map((owner) => owner.toLowerCase());
        const lowercaseWalletAddress = walletAddress.toLowerCase();

        if (lowercaseOwners.includes(lowercaseWalletAddress)) {
            NFTOwnedByWallet = true;
        }

        return NFTOwnedByWallet;
    }

    async getOwnersForTokenAndContract(contract: string, tokenId: number): Promise<string[]> {
        try{
            return (await this.alchemyService.getInstance().nft.getOwnersForNft(contract, tokenId)).owners;
        }catch(error) {
            console.error("Error connecting to alchemy api:", error.message);
            return Promise.resolve([]);
        }
    }

    async listByContracts({walletAddress, tokenAddresses, amount}: {walletAddress: string, tokenAddresses?: string[], amount}): Promise<any> 
    {
        // prep a collector for tokens by address
        let tokenCollections: { 
            [id: string] : { 
                contract_address: string; 
                token_count: number; 
                tokens: any[]
            }
        } = {};
        
        // ensure all token addresses exist for pushing tokens
        forEach(tokenAddresses, (address) => {
            tokenCollections[address.toLowerCase()] = {
                contract_address: address.toLowerCase(),
                token_count: 0,
                tokens: []
            };
        });


        const alchemySettings = this.alchemyService.getInstance();
        const pageSize = amount <= 100 ? amount : 100;

        for(let address of tokenAddresses){
            const nftsByCharacter = await alchemySettings.nft.getNftsForOwner(walletAddress, { pageSize, contractAddresses: [address] });
            this.loadNftsByCharacterType(tokenCollections, address.toLowerCase(), nftsByCharacter.ownedNfts,  amount);
        }

        // return collections in an order matching the provided tokenAddresses
        const collections = [];
        forEach(tokenAddresses, (address) => {
            collections.push(tokenCollections[address.toLowerCase()]);
        });

        return {
            wallet: walletAddress,
            tokens: collections
        };
        
    }


    private loadNftsByCharacterType(tokenCollections, address:string, ownedNFTS:OwnedNft[],  amount: number){
        for(let nft of ownedNFTS){
            tokenCollections[address].token_count = 1 + tokenCollections[address].token_count;
            tokenCollections[address].tokens.push({
                token_id: nft.tokenId,
                amount: nft.balance, 
                owner_of: "owner",
                contract_type: nft.contract.tokenType,
                name: nft.title,
                symbol: nft.contract.symbol,
                token_uri: nft.tokenUri,
                last_token_uri_sync: "yesterday",
                last_metadata_sync: "yesterday",
                metadata: nft.rawMetadata,
            });

            if(tokenCollections[address].token_count >= amount){
                break;
            }
        }
    }

}


