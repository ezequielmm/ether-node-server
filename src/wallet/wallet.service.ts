import { Injectable } from '@nestjs/common';
import { PlayerWinService } from '../playerWin/playerWin.service';
import { ContestService } from '../game/contest/contest.service';
import { countBy, sortBy } from 'lodash';
import { BridgeService } from 'src/bridge-api/bridge.service';
import { GetNftsByWalletResponse, TokenBridgeResponse } from 'src/bridge-api/bridge.types';
import { ContractResponse, NFTSFormattedResponse, TokenMetadata, TokenResponse } from './wallet.types';
import { CharacterClassEnum } from 'src/game/components/character/character.enum';

@Injectable()
export class WalletService {
    constructor(
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly bridgeService: BridgeService
    ) {}


    private getHttpFromIpfsURI(ipfs: string): string {
        return (ipfs) ? "https://ipfs.io/ipfs/" + ipfs.substring(7) : undefined;
    }

    async getTokenIdList(walletAddress: string, amount:number): Promise<any> {
        
        const contest = await this.contestService.findActiveContest();
        const event_id = contest?.event_id ?? 0;

        const all_wins = await this.playerWinService.findAllWins(walletAddress, event_id);

        const win_counts = countBy(
            all_wins,
            (win) => win.playerToken.contractId + win.playerToken.tokenId,
        );

        const squiresResponse = await this.bridgeService.getNftsByWallet(
            walletAddress,
            amount
        );

        const nfts = await this.formatTokens(squiresResponse, event_id, win_counts);
        return nfts;
    }

    private async formatTokens(squiresResponse:GetNftsByWalletResponse, event_id:number, win_counts): Promise<NFTSFormattedResponse> {
        
        let formatedNFTList:NFTSFormattedResponse = {
            wallet: squiresResponse.wallet,
            tokens: []
        };

        for await (const squiresContract of squiresResponse.contracts) {
            let contract:ContractResponse = {
                characterClass:   squiresContract.characterClass,
                contract_address: squiresContract.contract,
                token_count:      squiresContract.token_count,
                tokens:           []
            };
        
            for await (const squiresToken of squiresContract.tokens) {    
                const can_play = await this.playerWinService.canPlay(event_id, contract.contract_address, squiresToken.edition, win_counts[contract.contract_address + squiresToken.edition] || 0);
                const nft:TokenResponse = this.parseSquiresTokenToBlightfellToken(squiresToken, can_play, contract.characterClass);
                contract.tokens.push(nft);
            }

            //- Checkear el metodo de ordenamiento:
            contract.tokens = sortBy(contract.tokens, [(token) => token.token_id]);
            formatedNFTList.tokens.push(contract);
        }

        return formatedNFTList;
    }

    private parseSquiresTokenToBlightfellToken(squiresToken: TokenBridgeResponse, can_play:boolean, characterClass:string): TokenResponse {
        
        let metadata: TokenMetadata = {
            name: squiresToken.name,
            edition: squiresToken.edition,
            image: squiresToken.image,
            attributes: squiresToken.attributes
        }

        let initialized = false;
        if(characterClass === CharacterClassEnum.BlessedVillagerInitiated || characterClass === CharacterClassEnum.KnightInitiated){
            initialized = true;
        }

        let nft:TokenResponse = {
            token_id: ""+squiresToken.edition,
            name: squiresToken.name,
            adaptedImageURI: initialized ? squiresToken.image : this.getHttpFromIpfsURI(squiresToken.image),
            metadata: metadata,
            can_play: can_play,
            characterClass: characterClass
        }


        return nft;
    }
}
