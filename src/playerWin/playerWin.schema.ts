import { ModelOptions, Prop } from '@typegoose/typegoose';
import { IPlayerToken } from 'src/game/components/expedition/expedition.schema';

@ModelOptions({
    schemaOptions: { collection: 'playerWins', versionKey: false },
})

export class PlayerWin {
    @Prop()
    event_id: string;

    @Prop()
    playerToken: IPlayerToken;
}

export class PlayerWinInfo {
    wallet_id: string;
    event_id: string;
    contract_address: string;
    token_id: number;
}
