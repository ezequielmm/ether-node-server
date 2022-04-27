import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpeditionStatusEnum } from './enums';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
    @Prop()
    readonly client_id: string;

    @Prop()
    readonly player_id: string;

    @Prop()
    readonly map: [];

    @Prop()
    readonly player_state: object;

    @Prop()
    readonly current_node: object;

    @Prop()
    readonly status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
