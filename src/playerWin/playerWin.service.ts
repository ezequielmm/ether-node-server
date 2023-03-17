import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerWin } from './playerWin.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class PlayerWinService {
    constructor(
        @InjectModel(PlayerWin)
        private readonly playerWin: ReturnModelType<typeof PlayerWin>,
    ) {}

    async findAllWins(wallet_id: string) {
        const items = await this.playerWin.find({
            wallet_id,
        });
        return items;
    }

    async canPlay(
        event_id: string,
        contract_address: string,
        token_id: number,
        wins?: number,
    ): Promise<boolean> {
        if (wins == 0) return true;

        if (wins === undefined) {
            wins = await this.playerWin.find({
                event_id: event_id,
                contract_address: contract_address,
                token_id: token_id,
            }).length;
        }

        if (
            [
                '0x32A322C7C77840c383961B8aB503c9f45440c81f',
                '0x80e2109a826148b9b1a41b0958ca53a4cdc64b70',
            ].includes(contract_address)
        ) {
            if (token_id <= 500) {
                return wins < 3; // genesis knight
            }
            return wins < 2; // knight
        }

        return wins < 1; // villager & blessed villager
    }
}
