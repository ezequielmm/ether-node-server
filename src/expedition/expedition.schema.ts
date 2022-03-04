import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
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
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
