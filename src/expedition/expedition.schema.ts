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

    @Prop()
    readonly deck: string;

    @Prop()
    readonly map: string;

    @Prop()
    readonly nodes: string;

    @Prop()
    readonly player_state: string;

    @Prop()
    readonly current_state: string;

    @Prop()
    readonly status: ExpeditionStatus;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
