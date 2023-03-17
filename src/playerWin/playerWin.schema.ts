import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'playerWins', versionKey: false },
})
export class PlayerWin {
    @Prop()
    wallet_id: string;

    @Prop()
    event_id: string;

    @Prop()
    contract_address: string;

    @Prop()
    token_id: number;
}
export class PlayerWinInfo {
    wallet_id: string;
    event_id: string;
    contract_address: string;
    token_id: number;
}
