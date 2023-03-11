import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import NFTService from '../nft-library/services/nft_service';

@Injectable()
export class WalletService {
    private readonly logger: Logger = new Logger(WalletService.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getTokenIdList(walletId: string, contractId): Promise<string[]> {
        // the chain where are deployed the smart contracts
        const chain = 5;
        // The wallet address from he user
        const wallet = '0xa10f15b66a2e05c4e376f8bfc35ae662438153be';
        // The contracts to filter from all the user collections
        const contracts = [
            '0xF0aA34f832c34b32478B8D9696DC8Ad1c8065D2d',
            '0x80e2109a826148b9b1a41b0958ca53a4cdc64b70',
        ];
        const nfts = await NFTService.listByContracts(chain, wallet, contracts);

        return nfts;
        
        
        /*
        
        const domain = this.configService.get<string>('NFT_SERVICE_URL');
        const contract_id = this.configService.get<string>(
            'NFT_SERVICE_CONTRACT_ID',
        );
        const chain_id = this.configService.get<string>('NFT_SERVICE_CHAIN_ID');
        const authorization = this.configService.get<string>(
            'NFT_SERVICE_AUTHORIZATION',
        );
        const url = `${domain}/v1/accounts/${walletId}/contracts/${contractId}/chains/${chain_id}/tokens`;
        // a main chain wallet https://api.dev.kote.robotseamonster.com/v1/wallets/0xbd22537d05207e470A458773683041012ddcAB65
        // a goerli wallet http://localhost:3000/v1/wallets/0xA10f15B66a2e05c4e376F8bfC35aE662438153Be
        const tokenArray: string[] = [];
        try {
            const data = await firstValueFrom(
                this.httpService.get<any[]>(url, {
                    headers: {
                        Authorization: authorization,
                    },
                }),
            );

            const sub_data = data.data as any;
            const content = sub_data.data;
            const tokens = content.tokens;
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                tokenArray.push(token.tokenID);
            }
        } catch (e) {
            this.logger.log(e);
            throw e;
        }

        return tokenArray;
        */
    }
}
