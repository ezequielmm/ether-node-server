import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';
import { ExpeditionPlayerState } from 'src/interfaces/ExpeditionPlayerState.interface';

export type ExpeditionDocument = Expedition & Document;

export enum ExpeditionStatus {
    InProgress = 'in_progress',
    Victory = 'victory',
    Defeated = 'defeated',
    Canceled = 'canceled',
    Draft = 'draft',
}

@Schema()
export class Expedition {
    @Prop({ default: randomUUID(), required: false })
    readonly _id: string;

    @Prop()
    readonly player_id: string;

    @Prop({ type: Object, default: [] })
    readonly deck: object;

    @Prop({ type: Object, default: {} })
    readonly map: object;

    @Prop({ type: Object, default: {} })
    readonly player_state: ExpeditionPlayerState;

    @Prop({ type: Object, default: {} })
    readonly current_state: object;

    @Prop({ default: [] })
    trinkets?: [];

    @Prop({ default: ExpeditionStatus.Draft })
    readonly status: ExpeditionStatus;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
