import { Injectable } from "@nestjs/common";
import { Alchemy, Network } from "alchemy-sdk";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlchemyService {

    private alchemyInstance;
    public static MAINNET = "mainnet";
    public static TESTNET = "testnet";

    constructor(private readonly configService: ConfigService) {}
    
    public getInstance(): { arbitrum: Alchemy; ethereum: Alchemy } {
        if (!this.alchemyInstance) {
            this.alchemyInstance = this.getAlchemySettings();
        }

        return this.alchemyInstance;
    }
    
    private getAlchemySettings(){
        const net = this.configService.get("NFT_SERVICE_NET");

        const arbitrumSettings = {
            apiKey:  net == AlchemyService.MAINNET ? this.configService.get("NFT_SERVICE_ARB_MAINNET_API_KEY") : this.configService.get("NFT_SERVICE_ARB_TESTNET_API_KEY"),
            network: net == AlchemyService.MAINNET ? Network.ARB_MAINNET : Network.ARB_GOERLI
        };
    
        const ethereumSettings = {
            apiKey:  net == AlchemyService.MAINNET ? this.configService.get("NFT_SERVICE_ETH_MAINNET_API_KEY") : this.configService.get("NFT_SERVICE_ETH_TESTNET_API_KEY"),
            network: net == AlchemyService.MAINNET ? Network.ETH_MAINNET : Network.ETH_GOERLI,
        };
    
        return {
            arbitrum: new Alchemy(arbitrumSettings),
            ethereum: new Alchemy(ethereumSettings)
        }
    }
}

