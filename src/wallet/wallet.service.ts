import { Injectable } from '@nestjs/common';
import NFTService from '../nft-library/services/nft_service';
import { PlayerWinService } from '../playerWin/playerWin.service';
import { ContestMapService } from '../game/contestMap/contestMap.service';
import { ContestService } from '../game/contest/contest.service';
import { countBy } from 'lodash';
import { CharacterService } from 'src/game/components/character/character.service';

@Injectable()
export class WalletService {
    constructor(
        private playerWinService: PlayerWinService,
        private contestMapService: ContestMapService,
        private contestService: ContestService,
        private characterService: CharacterService,
    ) {}

    async getTokenIdList(walletId: string): Promise<any[]> {
        // the chain where are deployed the smart contracts
        const chain = Number(process.env.NFT_SERVICE_CHAIN_ID);

        //some goerli wallets
        //walletId = '0xa10f15b66a2e05c4e376f8bfc35ae662438153be'; //many knights
        //walletId = '0x66956Fe08D7Bc88fe70216502fD8a6e4b7f269c5';//2 knights
        //walletId = '0x2F2CF39D0325A9792f0C9E0de73cdc0820C5c65e'; //many knights

        // The contracts to filter from all the user collections
        const contracts = await this.characterService.findAllContractIds();

        const nfts = await NFTService.listByContracts(
            chain,
            walletId,
            contracts,
        );
        const all_wins = await this.playerWinService.findAllWins(walletId);
        const win_counts = countBy(
            all_wins,
            (win) => win.playerToken.contractId + win.playerToken.tokenId,
        );
        const contest = await this.contestService.findActive();
        const event_id = contest?.event_id ?? '';

        for (let i = 0; i < nfts.tokens.length; i++) {
            const contract_address = nfts.tokens[i].contract_address;
            for (let j = 0; j < nfts.tokens[i].tokens.length; j++) {
                const token_id = nfts.tokens[i].tokens[j].token_id;
                nfts.tokens[i].tokens[j].can_play =
                    await this.playerWinService.canPlay(
                        event_id,
                        contract_address,
                        token_id,
                        win_counts[contract_address + token_id] || 0,
                    );
            }
        }

        return nfts;
    }
}
