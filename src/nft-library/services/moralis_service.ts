import Moralis from 'moralis';

class MoralisService {
    initialize() {
        Moralis.start({
            apiKey: process.env.MORALIS_KEY,
            logLevel: process.env.MORALIS_LOG_LEVEL,
        });
    }
}

export default new MoralisService();
