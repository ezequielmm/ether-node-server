import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, Types, SchemaTypes } from 'mongoose';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
    @Prop({ default: randomUUID(), required: false })
    _id: string;

    @Prop()
    player_id: string;

    @Prop()
    deck: string;

    @Prop()
    map: string;

    @Prop()
    nodes: string;

    @Prop()
    player_state: string;

    @Prop()
    current_state: string;

    @Prop()
    status: string;

    @Prop({ default: [] })
    trinkets: [string];
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
