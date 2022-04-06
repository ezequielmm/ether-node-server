import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SocketClient {
    @Prop({ type: String })
    readonly player_id: string;

    @Prop({ type: String })
    readonly client_id: string;

    @Prop({ type: Date, default: new Date() })
    readonly created_at?: Date;
}

export const SocketClientSchema = SchemaFactory.createForClass(SocketClient);
