import { forEach } from 'lodash';
import { AlchemyService } from './alchemy_service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NFTService {

    // Hotfix Demo:
    
    //- Arbitrum:
    private MAIN_VILLAGER_CONTRACT_ID = "0x292Ff0F0c19373dd9c50faBba574Aaaf6E1BC11B"
    private TEST_VILLAGER_CONTRACT_ID = "0x913dB69145f33Af291F46E980e4c0CaBBfcC27AA"
    private MAIN_BLESSED_CONTRACT_ID = "0x73DdCE2656c343dc6655e76202768c703D1f540B"
    private TEST_BLESSED_CONTRACT_ID = "0xbFfd759b9F7d07ac76797cc13974031Eb23e5757"

    //- Ethereum:
    private MAIN_KNIGHT_CONTRACT_ID = "0x32A322C7C77840c383961B8aB503c9f45440c81f"
    private TEST_KNIGHT_CONTRACT_ID = "0x450210F1f501E94DB0DeA2eD1Cfc880aa803931a"
    
    // Hotfix Demo

    constructor(private readonly alchemyService: AlchemyService, private readonly configService: ConfigService){}

    async listByContracts({walletAddress, tokenAddresses, amount}: {walletAddress: string, tokenAddresses?: string[], amount}): Promise<any> 
    {
        // prep a collector for tokens by address
        let tokenCollections: { 
            [id: string] : { 
                contract_address: string; 
                token_count: number; 
                tokens: any[];
                isFull: boolean;
            }
        } = {};
        
        // ensure all token addresses exist for pushing tokens
        forEach(tokenAddresses, (address) => {
            tokenCollections[address.toLowerCase()] = {
                contract_address: address.toLowerCase(),
                token_count: 0,
                tokens: [],
                isFull: false
            };
        });

        // aggregate results across multiple pages
        const net = this.configService.get("NFT_SERVICE_NET");

        const pageSize = 100;
        let pageKey = undefined;
        let totalPages = 0;
        let actualPage = 0;
        let tokenFullList = true;

        const alchemySettings = this.alchemyService.getInstance();
        
        do {
            const nftsArbitrum = await alchemySettings.arbitrum.nft.getNftsForOwner(walletAddress, { pageSize, pageKey });
            totalPages = Math.ceil(nftsArbitrum.totalCount / pageSize);

            for(const token of nftsArbitrum.ownedNfts){
                if(tokenCollections[token.contract.address.toLowerCase()]){
                    if (tokenCollections[token.contract.address.toLowerCase()].tokens.length < amount) {
                        tokenCollections[token.contract.address.toLowerCase()].tokens.push({
                            token_id: token.tokenId,
                            amount: token.balance, 
                            owner_of: "owner",
                            contract_type: token.contract.tokenType,
                            name: token.title,
                            symbol: token.contract.symbol,
                            token_uri: token.tokenUri,
                            last_token_uri_sync: "yesterday",
                            last_metadata_sync: "yesterday",
                            metadata: token.rawMetadata,
                        });
                    }else{
                        tokenCollections[token.contract.address.toLowerCase()].isFull = true;
                    }
                }
            }


            // <---- HotFix for demo:
            if(net === "mainnet"){
                if(tokenCollections[this.MAIN_VILLAGER_CONTRACT_ID.toLowerCase()].isFull 
                    && tokenCollections[this.MAIN_BLESSED_CONTRACT_ID.toLowerCase()].isFull){
                    tokenFullList = true;
                }else{
                    tokenFullList = false;
                }
            }else if(net === "testnet"){
                if(tokenCollections[this.TEST_VILLAGER_CONTRACT_ID.toLowerCase()].isFull 
                    && tokenCollections[this.TEST_BLESSED_CONTRACT_ID.toLowerCase()].isFull){
                    tokenFullList = true;
                }else{
                    tokenFullList = false;
                }
            }

            // End HotFix for demo --->


            if(nftsArbitrum.pageKey){
                pageKey = nftsArbitrum.pageKey;
            }else{
                actualPage = totalPages;
            }

            actualPage++;

        } while (!tokenFullList && actualPage < totalPages);
        

        //- Ethereum Chain: ----------------------------------

        pageKey = undefined;
        totalPages = 0;
        actualPage = 0;
        tokenFullList = true;
        
        do {
            const nftsEthereum = await alchemySettings.ethereum.nft.getNftsForOwner(walletAddress, { pageSize, pageKey });
            totalPages = Math.ceil(nftsEthereum.totalCount / pageSize);

            for(const token of nftsEthereum.ownedNfts){
                if(tokenCollections[token.contract.address.toLowerCase()]){
                    if (tokenCollections[token.contract.address.toLowerCase()].tokens.length < amount) {
                        tokenCollections[token.contract.address.toLowerCase()].tokens.push({
                            token_id: token.tokenId,
                            amount: token.balance, 
                            owner_of: "owner",
                            contract_type: token.contract.tokenType,
                            name: token.title,
                            symbol: token.contract.symbol,
                            token_uri: token.tokenUri,
                            last_token_uri_sync: "yesterday",
                            last_metadata_sync: "yesterday",
                            metadata: token.rawMetadata,
                        });
                    }else{
                        tokenCollections[token.contract.address.toLowerCase()].isFull = true;
                    }
                }
            }

            // <---- HotFix for demo:
            if(net === "mainnet"){
                if(tokenCollections[this.MAIN_KNIGHT_CONTRACT_ID.toLowerCase()].isFull){
                    tokenFullList = true;
                }else{
                    tokenFullList = false;
                }
            }else if(net === "testnet"){
                if(tokenCollections[this.TEST_KNIGHT_CONTRACT_ID.toLowerCase()].isFull){
                    tokenFullList = true;
                }else{
                    tokenFullList = false;
                }
            }

            // End HotFix for demo --->


            if(nftsEthereum.pageKey){
                pageKey = nftsEthereum.pageKey;
            }else{
                actualPage = totalPages;
            }

            actualPage++;

        } while (!tokenFullList && actualPage < totalPages);

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

}


