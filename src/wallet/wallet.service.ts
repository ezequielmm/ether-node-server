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

    async getTokenIdList(walletAddress: string, amount:number): Promise<any[]> {
        
        const contest = await this.contestService.findActiveContest();
        const event_id = contest?.event_id ?? 0;

        const all_wins = await this.playerWinService.findAllWins(walletAddress, event_id);

        const win_counts = countBy(
            all_wins,
            (win) => win.playerToken.contractId + win.playerToken.tokenId,
        );
        
        

        // The contracts to filter from all the user collections
        const tokenAddresses = await this.characterService.findAllContractIds();

        for(let i = 0 ; i < tokenAddresses.length; i++ )
        {   
            if(tokenAddresses[i] == "0xb52d71C3DdE0cEE0faD2dCE0a9cA33fDfE06aEc9")
            {
                tokenAddresses[i]="0x16Ed951d479b87634d5E9e7C05a8316672A4c926";
            }
        }
        const nfts = await this.nftService.listByContracts({
            walletAddress,
            tokenAddresses,
            amount
        });

        for await (const contract of nfts.tokens) {
            if(contract.contract_address == "0xb52d71C3DdE0cEE0faD2dCE0a9cA33fDfE06aEc9")
            {
                //sorry camilo, hardcoded for test env.
                contract.contract_address = "0x16Ed951d479b87634d5E9e7C05a8316672A4c926";
            }
            const character = await this.characterService.getCharacterByContractId(contract.contract_address);
            contract.characterClass = character?.characterClass ?? 'unknown';
            contract.contract_address = character.contractId;
           
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
