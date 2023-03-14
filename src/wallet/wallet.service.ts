import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import NFTService from '../nft-library/services/nft_service';
import { PlayerWinService } from '../playerWin/playerWin.service';

@Injectable()
export class WalletService {
    constructor(private playerWinService: PlayerWinService) {}

    async getTokenIdList(walletId: string): Promise<string[]> {
        // the chain where are deployed the smart contracts
        const chain = Number(process.env.NFT_SERVICE_CHAIN_ID);
        //some goerli wallets
        //walletId = '0xa10f15b66a2e05c4e376f8bfc35ae662438153be'; //many knights
        //walletId = '0x66956Fe08D7Bc88fe70216502fD8a6e4b7f269c5';//2 knights
        //walletId = '0x2F2CF39D0325A9792f0C9E0de73cdc0820C5c65e'; //many knights
        // The contracts to filter from all the user collections
        let contracts = [];
        if (chain === 1) {
            contracts = [
                '0x32A322C7C77840c383961B8aB503c9f45440c81f',
                '0xbB4342E7aB28fd581d751b064dd924BCcd860faC',
                '0x2d51402A6DAb0EA48E30Bb169db74FfE3c1c6675', //subject to change
            ];
        }
        if (chain === 5) {
            contracts = [
                '0x80e2109a826148b9b1a41b0958ca53a4cdc64b70',
                '0xF0aA34f832c34b32478B8D9696DC8Ad1c8065D2d',
                '0x55abb816b145CA8F34ffA22D63fBC5bc57186690',
            ];
        }
        const nfts = await NFTService.listByContracts(
            chain,
            walletId,
            contracts,
        );
        const event_id = '0';

        const allWins = await this.playerWinService.findAllWins(walletId);
        allWins[0].event_id;
        //allWins.filter();

        for (let i = 0; i < nfts.tokens.length; i++) {
            const over_token = nfts.tokens[i];
            const contract_address = over_token.contract_address;
            for (let j = 0; j < over_token.tokens.length; j++) {
                const token_id = nfts.tokens[i].tokens[j].token_id;
                const can_play = await this.playerWinService.canPlay(
                    event_id,
                    contract_address,
                    token_id,
                );
                nfts.tokens[i].tokens[j].can_play = can_play;
            }
        }

        return nfts;
    }
}
