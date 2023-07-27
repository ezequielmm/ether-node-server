import { Injectable } from "@nestjs/common";
import { Alchemy, Network } from "alchemy-sdk";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlchemyService {

    public static MAINNET = "mainnet";
    public static TESTNET = "testnet";

    private alchemyInstance:Alchemy;

    constructor(private readonly configService: ConfigService) {}
    
    public getInstance(): Alchemy {
        if (!this.alchemyInstance) {
            this.alchemyInstance = this.getAlchemySettings();
        }

        return this.alchemyInstance;
    }
    
    private getAlchemySettings(): Alchemy {

        const net = this.configService.get("NFT_SERVICE_NET");

        const arbitrum = new Alchemy({
            apiKey:  net == AlchemyService.MAINNET ? this.configService.get("NFT_SERVICE_ARB_MAINNET_API_KEY") : this.configService.get("NFT_SERVICE_ARB_TESTNET_API_KEY"),
            network: net == AlchemyService.MAINNET ? Network.ARB_MAINNET : Network.ARB_GOERLI
        });

        return arbitrum;
    }
}

