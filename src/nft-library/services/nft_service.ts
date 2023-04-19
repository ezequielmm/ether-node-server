import { forEach, values } from 'lodash';
import Moralis from 'moralis';

class NFTService {

    async listByContracts({
        chain,
        walletAddress,
        tokenAddresses
    }: {
        chain: number;
        walletAddress: string,
        tokenAddresses?: string[]
    }): Promise<any> {

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
        let cursor = null;
        do {

          const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address: walletAddress,
            chain,
            tokenAddresses,
            limit: 100,
            cursor: cursor,
          });

          // parse page into return object here
          if (typeof response.raw.result !== 'undefined') {
            for (const token of response.raw.result) {
                if (typeof tokenCollections[token.token_address.toLowerCase()] === 'undefined') continue;

                let metadata = '';
                try {
                    metadata = JSON.parse(token.metadata ?? '');
                } catch (e) {
                    metadata = '';
                }
                
                tokenCollections[token.token_address.toLowerCase()].tokens.push({
                    token_id: token.token_id,
                    amount: token.amount,
                    owner_of: token.owner_of,
                    contract_type: token.contract_type,
                    name: token.name,
                    symbol: token.symbol,
                    token_uri: token.token_uri,
                    last_token_uri_sync: token.last_token_uri_sync,
                    last_metadata_sync: token.last_metadata_sync,
                    metadata: metadata,
                });
            }
          }

          // set cursor if there is one
          cursor = response.raw.cursor ?? null;

        } while (cursor != "" && cursor != null);

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


/*
    const tokens = response.raw.result;
    const nfts = [];

    if (typeof tokens != 'undefined') {
        for (let i = 0; i < contracts.length; i++) {
            const contract = contracts[i].toLowerCase();
            const collection = [];

            for (let j = 0; j < tokens.length; j++) {
                const token = tokens[j];
                if (typeof token.token_address === 'undefined') {
                    console.log('token.token_address===undefined');
                }
                let metadata = '';
                try {
                    metadata = JSON.parse(token.metadata ?? '');
                } catch (e) {
                    metadata = '';
                }
                if (token.token_address.toLowerCase() == contract) {
                    collection.push({
                        token_id: token.token_id,
                        amount: token.amount,
                        owner_of: token.owner_of,
                        contract_type: token.contract_type,
                        name: token.name,
                        symbol: token.symbol,
                        token_uri: token.token_uri,
                        last_token_uri_sync: token.last_token_uri_sync,
                        last_metadata_sync: token.last_metadata_sync,
                        metadata: metadata,
                    });
                }
            }

            nfts.push({
                contract_address: contract,
                token_count: collection.length,
                tokens: collection,
            });
        }
    }

    return {
        wallet: address,
        tokens: nfts,
    };
*/

}

export default new NFTService();
