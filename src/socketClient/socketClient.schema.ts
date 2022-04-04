import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocketClientDocument = SocketClient & Document;

@Schema()
export class SocketClient {
    @Prop()
    readonly player_id: string;

    @Prop()
    readonly client_id: string;
}

export const SocketClientSchema = SchemaFactory.createForClass(SocketClient);
