import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { PlayerStateInterface } from 'src/interfaces/playerState.interface';

@Schema()
export class Expedition {
    @Prop({ default: randomUUID(), required: false })
    readonly _id: string;

    @Prop({ required: true })
    readonly player_id: string;

    @Prop({ default: [], required: false })
    readonly deck: object;

    @Prop({ default: {}, required: false })
    readonly map: object;

    @Prop({ required: true })
    readonly player_state: PlayerStateInterface;

    @Prop({ default: {}, required: false })
    readonly current_state: object;

    @Prop({ default: [], required: false })
    readonly trinkets?: [];

    @Prop({ default: ExpeditionStatusEnum.Draft, required: false })
    readonly status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
