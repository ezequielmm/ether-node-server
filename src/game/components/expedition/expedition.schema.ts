import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
    ExpeditionStatusEnum,
} from './expedition.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionPlayerStateDeckCard,
    IExpeditionReward,
} from './expedition.interface';

export type ExpeditionDocument = Expedition & Document;

@Schema({
    collection: 'expeditions',
})
export class Expedition {
    @Prop()
    clientId?: string;

    @Prop()
    playerId: number;

    @Prop()
    map: IExpeditionNode[];

    @Prop({ type: Object })
    playerState: {
        playerId: string;
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
            playing: CombatTurnEnum;
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
                statuses: {
                    [StatusType.Buff]: AttachedStatus[];
                    [StatusType.Debuff]: AttachedStatus[];
                };
            };
            enemies: IExpeditionCurrentNodeDataEnemy[];
            rewards: IExpeditionReward[];
        };
    };

    @Prop({ default: ExpeditionStatusEnum.InProgress })
    status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
