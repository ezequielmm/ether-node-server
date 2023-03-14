import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'playerWins', versionKey: false },
})
export class PlayerWin {
    @Prop()
    playerId: string;

    @Prop()
    event_id: string;

    @Prop()
    contract_address: string;

    @Prop()
    token_id: string;
}
