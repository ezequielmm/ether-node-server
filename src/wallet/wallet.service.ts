import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getTokenIdList(walletId: string): Promise<string[]> {
        const domain = this.configService.get<string>('NFT_SERVICE_URL');
        const contract_id = this.configService.get<string>(
            'NFT_SERVICE_CONTRACT_ID',
        );

        const url = `${domain}/v1/accounts/${walletId}/contracts/${contract_id}/chains/1/tokens`;
        //for example https://api.dev.kote.robotseamonster.com/v1/wallets/0xbd22537d05207e470A458773683041012ddcAB65
        const data = await firstValueFrom(
            this.httpService.get<any[]>(url, {
                headers: {
                    Authorization:
                        'vJGApId83NIZnmfkWUrFGOjdxTr4IQBM2WRq2PBj2pjEdZrirC6fAiL1orifv2VO',
                },
            }),
        );

        const sub_data = data.data as any;
        const content = sub_data.data;
        const tokens = content.tokens;
        const tokenArray: string[] = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            tokenArray.push(token.tokenID);
        }

        return tokenArray;
    }
}
