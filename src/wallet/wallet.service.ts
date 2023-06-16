import { Injectable } from '@nestjs/common';
import { PlayerWinService } from '../playerWin/playerWin.service';
import { ContestService } from '../game/contest/contest.service';
import { countBy, sortBy } from 'lodash';
import { CharacterService } from 'src/game/components/character/character.service';
import { NFTService } from 'src/nft-library/services/nft_service';

@Injectable()
export class WalletService {
    constructor(
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly characterService: CharacterService,
        private readonly nftService: NFTService
    ) {}

    private getHttpFromIpfsURI(ipfs: string): string {
        return (ipfs) ? "https://ipfs.io/ipfs/" + ipfs.substring(7) : undefined;
    }

    async getTokenIdList(walletAddress: string): Promise<any[]> {
        const all_wins = await this.playerWinService.findAllWins(walletAddress);
        const win_counts = countBy(
            all_wins,
            (win) => win.playerToken.contractId + win.playerToken.tokenId,
        );
        const contest = await this.contestService.findActiveContest();
        const event_id = contest?.event_id ?? 0;

        // The contracts to filter from all the user collections
        const tokenAddresses = await this.characterService.findAllContractIds();

        const nfts = await this.nftService.listByContracts({
            walletAddress,
            tokenAddresses
        });

        for await (const contract of nfts.tokens) {
            const character = await this.characterService.getCharacterByContractId(contract.contract_address);
            contract.characterClass = character?.characterClass ?? 'unknown';
            for await (const token of contract.tokens) {
                token.characterClass = character?.characterClass ?? 'unknown';
                token.adaptedImageURI = this.getHttpFromIpfsURI(token.metadata?.image);
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
