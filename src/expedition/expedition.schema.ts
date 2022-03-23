import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type ExpeditionDocument = Expedition & Document;

export enum ExpeditionStatus {
    InProgress = 'in_progress',
    Victory = 'victory',
    Defeated = 'defeated',
    Canceled = 'canceled',
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
    readonly player_state: object;

    @Prop({ type: Object, default: {} })
    readonly current_state: object;

    @Prop()
    readonly status: ExpeditionStatus;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
