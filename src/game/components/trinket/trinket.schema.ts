import { ModelOptions, Prop } from '@typegoose/typegoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { GameContext } from '../interfaces';
import { TrinketRarityEnum } from './trinket.enum';

@ModelOptions({
    schemaOptions: {
        collection: 'trinkets',
        discriminatorKey: 'name',
        _id: false,
    },
})
export class Trinket {
    @Prop()
    instanceId: number;

    @Prop()
    trinketId: number;

    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop()
    rarity: TrinketRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];

    onAttach(_ctx: GameContext): void {
        throw new Error('Method not implemented.');
    }
}
