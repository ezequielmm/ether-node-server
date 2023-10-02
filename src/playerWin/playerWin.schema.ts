import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { IPlayerToken } from 'src/game/components/expedition/expedition.schema';
import { Gear } from 'src/game/components/gear/gear.schema';
@ModelOptions({
    schemaOptions: { collection: 'playerWins', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class PlayerWin {
    @Prop()
    event_id: number;

    @Prop()
    playerToken: IPlayerToken;

    /@Prop()
    lootbox: Gear[]
}
