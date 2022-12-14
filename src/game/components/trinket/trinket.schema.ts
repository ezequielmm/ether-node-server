import { ModelOptions, Prop, SubDocumentType } from '@typegoose/typegoose';
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
        versionKey: false,
    },
})
export class Trinket<T = any> {
    @Prop({ default: () => randomUUID() })
    id: string;

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

    onAttach(_ctx: GameContext) {
        //throw new Error('Method not implemented.');
    }

    trigger(this: SubDocumentType<T>, ctx: GameContext) {
        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.TrinketTriggered,
                action: SWARAction.FlashTrinketIcon,
                data: {
                    ...this.toObject(),
                },
            }),
        );
    }

    static TrinketId: number;
}
