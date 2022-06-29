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
    clientId?: string;

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
        potions?: [];
        trinkets?: [];
        createdAt: Date;
        cards: IExpeditionPlayerStateDeckCard[];
        stoppedAt?: Date;
    };

    @Prop({ type: Object })
    currentNode?: {
        nodeId: number;
        nodeType: ExpeditionMapNodeTypeEnum;
        completed: boolean;
        data?: {
            round: number;
            player: {
                energy: number;
                energyMax?: number;
                handSize: number;
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
