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
        contest_id: string,
        contract_address: string,
        token_id: string,
    ): Promise<boolean> {
        const item = await this.playerWin.findOne({
            contest_id: contest_id,
            contract_address: contract_address,
            token_id: token_id,
        });
        return item === null;
    }
}
