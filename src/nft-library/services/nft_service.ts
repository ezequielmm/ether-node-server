import Moralis from 'moralis';

class NFTService {
    async listByContracts(
        chain: number,
        address: string,
        contracts: string[],
    ): Promise<any> {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain,
        });

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
    }
}

export default new NFTService();
