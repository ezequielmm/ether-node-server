import { forEach } from 'lodash';
import { AlchemyService } from './alchemy_service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OwnedNft } from 'alchemy-sdk';

@Injectable()
export class NFTService {

    // Hotfix Demo:
    
    //- Arbitrum:
    private MAIN_VILLAGER_CONTRACT_ID = "0x292Ff0F0c19373dd9c50faBba574Aaaf6E1BC11B"
    private TEST_VILLAGER_CONTRACT_ID = "0x913dB69145f33Af291F46E980e4c0CaBBfcC27AA"
    private MAIN_BLESSED_CONTRACT_ID  = "0x73DdCE2656c343dc6655e76202768c703D1f540B"
    private TEST_BLESSED_CONTRACT_ID  = "0xbFfd759b9F7d07ac76797cc13974031Eb23e5757"
    private MAIN_KNIGHT_CONTRACT_ID   = "0xb52d71C3DdE0cEE0faD2dCE0a9cA33fDfE06aEc9"
    private TEST_KNIGHT_CONTRACT_ID   = "0x450210F1f501E94DB0DeA2eD1Cfc880aa803931a"
    
    // Hotfix Demo

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

        // aggregate results across multiple pages
        const net = this.configService.get("NFT_SERVICE_NET");
        const alchemySettings = this.alchemyService.getInstance();

        const pageSize = amount <= 100 ? amount : 100;

        let villagerAddress = net === AlchemyService.MAINNET ? this.MAIN_VILLAGER_CONTRACT_ID : this.TEST_VILLAGER_CONTRACT_ID;
        const villagers = await alchemySettings.nft.getNftsForOwner(walletAddress, { pageSize, contractAddresses: [villagerAddress] });

        let blessedVillagerAddress = net === AlchemyService.MAINNET ? this.MAIN_BLESSED_CONTRACT_ID : this.TEST_BLESSED_CONTRACT_ID;
        const blessedVillagers = await alchemySettings.nft.getNftsForOwner(walletAddress, { pageSize, contractAddresses: [blessedVillagerAddress] });

        let knightAddress = net === AlchemyService.MAINNET ? this.MAIN_KNIGHT_CONTRACT_ID : this.TEST_KNIGHT_CONTRACT_ID;
        const knights = await alchemySettings.nft.getNftsForOwner(walletAddress, { pageSize, contractAddresses: [knightAddress] });

        this.loadNftsByCharacterType(tokenCollections, villagerAddress.toLowerCase(), villagers.ownedNfts,  amount);
        this.loadNftsByCharacterType(tokenCollections, blessedVillagerAddress.toLowerCase(), blessedVillagers.ownedNfts, amount);
        this.loadNftsByCharacterType(tokenCollections, knightAddress.toLowerCase(), knights.ownedNfts, amount);

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


