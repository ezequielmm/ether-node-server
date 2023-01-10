import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletService {
    constructor(private readonly httpService: HttpService) {}
    async getTokenIdList(walletId: string): Promise<any> {
        const protocol = 'http://';
        const domain = 'nft-service.dev.robotseamonster.com';
        const data = await firstValueFrom(
            this.httpService.get<any[]>(
                protocol +
                    domain +
                    '/v1/accounts/' +
                    walletId +
                    '/contracts/0x32A322C7C77840c383961B8aB503c9f45440c81f/chains/1/tokens',
                {
                    headers: {
                        Authorization:
                            'vJGApId83NIZnmfkWUrFGOjdxTr4IQBM2WRq2PBj2pjEdZrirC6fAiL1orifv2VO',
                    },
                },
            ),
        );
        const sub_data = data.data as any;
        const content = sub_data.data;
        return content;
    }
}
