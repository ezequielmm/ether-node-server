import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerWin } from './playerWin.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CharacterService } from 'src/game/components/character/character.service';

@Injectable()
export class PlayerWinService {
    constructor(
        @InjectModel(PlayerWin)
        private readonly playerWin: ReturnModelType<typeof PlayerWin>,
        private readonly characterService: CharacterService,
    ) {}

    async create(contest_info: PlayerWin) {
        return await this.playerWin.create(contest_info);
    }

    async findAllWins(wallet_id: string) {
        const items = await this.playerWin.find({
            playerToken: { $elemMatch: { wallet_id: wallet_id } },
        });
        return items;
    }

    async canPlay(
        event_id: number,
        contract_address: string,
        token_id: number,
        wins?: number,
    ): Promise<boolean> {
        if (event_id === 0) return true;

        if (wins === undefined) {
            wins = await this.playerWin.find({
                event_id: event_id,
                playerToken: {
                    $elemMatch: {
                        contractId: contract_address,
                        tokenId: token_id,
                    },
                },
            }).length;
        }
        if (wins == 0) return true;

        const character = await this.characterService.getCharacterByContractId(
            contract_address,
        );

        if (!character || character.name != 'Knight') return wins < 1;

        // at this point, it's a knight
        if (token_id <= 500) {
            return wins < 3; // genesis knight
        }

        return wins < 2; // knight
    }
}
