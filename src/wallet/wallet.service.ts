import { ConsoleLogger, Injectable } from '@nestjs/common';
import NFTService from '../nft-library/services/nft_service';
import { PlayerWinService } from '../playerWin/playerWin.service';
import { ContestService } from '../game/contest/contest.service';
import { countBy, sortBy } from 'lodash';
import { CharacterService } from 'src/game/components/character/character.service';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';

@Injectable()
export class WalletService {
    constructor(
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly characterService: CharacterService,
        private readonly configService: ConfigService,
    ) {}

    async getTokenIdList(walletId: string): Promise<any[]> {
        // the chain where are deployed the smart contracts
        const chain = this.configService.get<number>('NFT_SERVICE_CHAIN_ID');

        //some goerli wallets
        //walletId = '0xa10f15b66a2e05c4e376f8bfc35ae662438153be'; //many knights
        //walletId = '0x66956Fe08D7Bc88fe70216502fD8a6e4b7f269c5';//2 knights
        //walletId = '0x2F2CF39D0325A9792f0C9E0de73cdc0820C5c65e'; //many knights

        const all_wins = await this.playerWinService.findAllWins(walletId);
        const win_counts = countBy(
            all_wins,
            (win) => win.playerToken.contractId + win.playerToken.tokenId,
        );
        const contest = await this.contestService.findActiveContest();
        const event_id = contest?.event_id ?? 0;

        // The contracts to filter from all the user collections
        const contracts = await this.characterService.findAllContractIds();
        const nfts = await NFTService.listByContracts(
            chain,
            walletId,
            contracts,
        );

        for await (const contract of nfts.tokens) {
            const characterClass = this.characterService.getCharacterByContractId(contract.contract_address);
            for await (const token of contract.tokens) {
                token.characterClass = characterClass;
                token.can_play =
                    await this.playerWinService.canPlay(
                        event_id,
                        contract.contract_address,
                        token.token_id,
                        win_counts[contract.contract_address + token.token_id] || 0,
                    );
            }
            contract.tokens = sortBy(contract.tokens, [(token) => <number>token.token_id]);
        }

        return nfts;
    }
}
