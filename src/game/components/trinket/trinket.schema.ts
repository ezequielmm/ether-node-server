import { ModelOptions, Prop } from '@typegoose/typegoose';
import { randomUUID } from 'crypto';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GameContext } from '../interfaces';
import { TrinketRarityEnum } from './trinket.enum';

@ModelOptions({
    schemaOptions: {
        collection: 'trinkets',
        _id: false,
    },
})
export class Trinket {
    @Prop({ default: () => randomUUID() })
    id: number;

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

    onAttach(_ctx: GameContext): void {
        throw new Error('Method not implemented.');
    }

    trigger(ctx: GameContext) {
        ctx.client.send(
            StandardResponse.respond({
                message_type: SWARMessageType.TrinketTriggered,
                action: SWARAction.FlashTrinketIcon,
                data: {
                    ...this,
                },
            }),
        );
    }

    static TrinketId: number;
}
