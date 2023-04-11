import Moralis from 'moralis';

class MoralisService {
    initialize(apiKey: string, logLevel: string) {
        Moralis.start({
            apiKey,
            logLevel,
        });
    }
}

export default new MoralisService();
