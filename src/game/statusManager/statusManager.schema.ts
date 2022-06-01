import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatusManagerDocument = StatusManager & Document;

@Schema()
export class StatusManager {
    @Prop()
    client_id: string;

    @Prop()
    player_id: string;

    @Prop()
    expedition_id: string;
}
