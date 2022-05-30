import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpeditionStatusEnum } from './enums';
import {
    IExpeditionNode,
    IExpeditionCurrentNode,
    IExpeditionPlayerState,
} from './interfaces';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
    @Prop()
    client_id: string;

    @Prop()
    player_id: string;

    @Prop()
    map: IExpeditionNode[];

    @Prop({ type: Object })
    player_state: IExpeditionPlayerState;

    @Prop({ type: Object })
    current_node: IExpeditionCurrentNode;

    @Prop({ default: ExpeditionStatusEnum.InProgress })
    status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
