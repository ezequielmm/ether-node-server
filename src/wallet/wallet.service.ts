import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
    private readonly logger: Logger = new Logger(WalletService.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getTokenIdList(walletId: string): Promise<string[]> {
        const domain = this.configService.get<string>('NFT_SERVICE_URL');
        const contract_id = this.configService.get<string>(
            'NFT_SERVICE_CONTRACT_ID',
        );
        const chain_id = this.configService.get<string>('NFT_SERVICE_CHAIN_ID');
        const authorization = this.configService.get<string>(
            'NFT_SERVICE_AUTHORIZATION',
        );
        const url = `${domain}/v1/accounts/${walletId}/contracts/${contract_id}/chains/${chain_id}/tokens`;
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
    }
}
