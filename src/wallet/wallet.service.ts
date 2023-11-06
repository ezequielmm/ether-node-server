import { Injectable } from '@nestjs/common';
import { PlayerWinService } from '../playerWin/playerWin.service';
import { ContestService } from '../game/contest/contest.service';
import { countBy, sortBy } from 'lodash';
import { CharacterService } from 'src/game/components/character/character.service';
import { NFTService } from 'src/nft-library/services/nft_service';
import { BridgeService } from 'src/bridge-api/bridge.service';
import { GetNftsByWalletResponse, TokenBridgeResponse } from 'src/bridge-api/bridge.types';
import { ContractResponse, NFTSFormattedResponse, TokenMetadata, TokenResponse } from './wallet.types';

@Injectable()
export class WalletService {
    constructor(
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
        private readonly characterService: CharacterService,
        private readonly nftService: NFTService,
        private readonly bridgeService: BridgeService
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


        // Squires
        const squiresResponse = await this.bridgeService.getNftsByWallet(
            walletAddress,
            amount
        );

        return await this.formatTokens(squiresResponse, event_id, win_counts);
    }

    private async formatTokens(squiresResponse:GetNftsByWalletResponse, event_id:number, win_counts): Promise<ContractResponse[]> {
        
        let formatedNFTList:NFTSFormattedResponse;
        formatedNFTList.wallet = squiresResponse.wallet;

        for await (const squiresContract of squiresResponse.contracts) {
            let contract:ContractResponse;

            const character  = await this.characterService.getCharacterByContractName(contract.characterClass);
            contract.characterClass   = character?.characterClass ?? 'unknown';
            contract.contract_address = squiresContract.contract;
            contract.token_count      = contract.token_count;
            contract.tokens = [];
        
            for await (const squiresToken of squiresContract.tokens) {    
                
                const can_play = await this.playerWinService.canPlay(event_id, contract.contract_address, squiresToken.edition, win_counts[contract.contract_address + squiresToken.edition] || 0);

                let nft:TokenResponse = this.parseSquiresTokenToBlightfellToken(squiresToken);
                nft.characterClass    = contract.characterClass;
                nft.can_play          = can_play;
                contract.tokens.push(nft);
            }

            //- Checkear el metodo de ordenamiento:
            contract.tokens = sortBy(contract.tokens, [(token) => token.token_id]);
            formatedNFTList.tokens.push(contract);
        }

        return formatedNFTList.tokens;
    }

    private parseSquiresTokenToBlightfellToken(squiresToken: TokenBridgeResponse):TokenResponse {
        
        let metadata: TokenMetadata;
        metadata.name       = squiresToken.name;
        metadata.edition    = squiresToken.edition;
        metadata.image      = squiresToken.image;
        metadata.attributes = squiresToken.attributes;

        let nft:TokenResponse;
        nft.token_id            = ""+squiresToken.edition;
        nft.name                = squiresToken.name;
        nft.adaptedImageURI     = squiresToken.image;
        nft.metadata            = metadata;

        return nft;
    }
}
