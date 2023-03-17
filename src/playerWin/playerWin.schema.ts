import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'playerWins', versionKey: false },
})
export class PlayerWin {
    @Prop()
    wallet_id: string;

    @Prop()
    contest_id: string;

    @Prop()
    contract_address: string;

    @Prop()
    token_id: string;
}
