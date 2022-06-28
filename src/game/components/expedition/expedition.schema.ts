import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionStatusEnum,
} from './expedition.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';

export type ExpeditionDocument = Expedition & Document;

@Schema()
export class Expedition {
    @Prop()
    clientId: string;

    @Prop()
    playerId: number;

    @Prop()
    map: IExpeditionNode[];

    @Prop({ type: Object })
    playerState: {
        playerName: string;
        characterClass: string;
        hpMax: number;
        hpCurrent: number;
        gold: number;
        potions: [];
        trinkets: [];
        createdAt: Date;
        deck: {
            cards: IExpeditionPlayerStateDeckCard[];
        };
        stoppedAt?: Date;
    };

    @Prop({ type: Object })
    currentNode: {
        node_id: number;
        node_type: ExpeditionMapNodeTypeEnum;
        completed: boolean;
        data?: {
            round: number;
            player: {
                energy: number;
                energy_max?: number;
                hand_size: number;
                defense: number;
                cards: {
                    hand: IExpeditionPlayerStateDeckCard[];
                    draw: IExpeditionPlayerStateDeckCard[];
                    discard: IExpeditionPlayerStateDeckCard[];
                    exhausted: IExpeditionPlayerStateDeckCard[];
                };
            };
            enemies: IExpeditionCurrentNodeDataEnemy[];
        };
    };

    @Prop({ default: ExpeditionStatusEnum.InProgress })
    status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
