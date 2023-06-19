import { forEach } from 'lodash';
import { AlchemyService } from './alchemy_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NFTService {

    constructor(private readonly alchemyService: AlchemyService){}

    async listByContracts({walletAddress, tokenAddresses, amount}: {walletAddress: string, tokenAddresses?: string[], amount}): Promise<any> 
    {
        // prep a collector for tokens by address
        let tokenCollections: { 
            [id: string] : { 
                contract_address: string; 
                token_count: number; 
                tokens: any[];
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
        const pageSize = 100;
        let pageKey = undefined;
        let totalPages = 0;
        let actualPage = 0;

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
                    }
                }
            }

            if(nftsArbitrum.pageKey){
                pageKey = nftsArbitrum.pageKey;
            }else{
                actualPage = totalPages;
            }

            actualPage++;

        } while (actualPage < totalPages);
        

        //- Ethereum Chain: ----------------------------------

        pageKey = undefined;
        totalPages = 0;
        actualPage = 0;
        
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
                    }
                }
            }

            if(nftsEthereum.pageKey){
                pageKey = nftsEthereum.pageKey;
            }else{
                actualPage = 1;
            }

            actualPage++;

        } while (actualPage < totalPages);

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


