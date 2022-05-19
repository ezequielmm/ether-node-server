import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpeditionStatusEnum } from './enums';
import {
    IExpeditionNode,
    IExpeditionCurrentNode,
    IExpeditionMap,
    IExpeditionPlayerState,
} from './interfaces';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
    @Prop()
    readonly client_id: string;

    @Prop()
    readonly player_id: string;

    @Prop()
    readonly map: IExpeditionNode[];
    // readonly map: IExpeditionMap[];
    @Prop({ type: Object })
    readonly player_state: IExpeditionPlayerState;

    @Prop({ type: Object })
    readonly current_node: IExpeditionCurrentNode;

    @Prop({ default: ExpeditionStatusEnum.InProgress })
    readonly status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
