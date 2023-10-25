import { modelOptions, Prop, PropType, Ref, Severity } from '@typegoose/typegoose';
import mongoose, { HydratedDocument, ObjectId, Schema, Types } from 'mongoose';
import { MerchantItems } from 'src/game/merchant/merchant.interface';
import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { TreasureInterface } from 'src/game/treasure/treasure.interfaces';
import { CombatTurnEnum, ExpeditionStatusEnum } from './expedition.enum';
import { NodeType } from './node-type';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerStateDeckCard,
    Reward,
} from './expedition.interface';
import { Player } from './player';
import { ExpeditionActConfig } from './expeditionActConfig.schema';
import { EncounterInterface } from '../encounter/encounter.interfaces';
import { Score } from './scores';
import { ScoreResponse } from 'src/game/scoreCalculator/scoreCalculator.service';
import { Contest } from 'src/game/contest/contest.schema';
import { MapType } from './map.schema';

export type ExpeditionDocument = HydratedDocument<Expedition>;

export interface IPlayerToken {
    walletId: string;
    contractId: string;
    tokenId: number;
}


@modelOptions({
    schemaOptions: { collection: 'expeditions', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})

export class Expedition {
    @Prop()
    clientId?: string;

    @Prop()
    userAddress: string;

    @Prop()
    actConfig?: ExpeditionActConfig;

    @Prop()
    scores?: Score;

    @Prop()
    mapSeedId?: number;

    @Prop({ ref: MapType }) // Indica que este campo es una referencia a MapType
    map: Ref<MapType>; // El tipo Ref<T> se utiliza para campos de referencia en typegoose

    @Prop()
    playerState: Player;

    @Prop()
    finalScore?: ScoreResponse;

    @Prop({ type: Object })
    currentNode?: {
        nodeId: number;
        nodeType: NodeType;
        nodeSubType?: NodeType;
        completed: boolean;
        showRewards: boolean;
        data?: {
            round: number;
            playing: CombatTurnEnum;
            player: {
                energy: number;
                energyMax?: number;
                handSize: number;
                defense: number;
                hpCurrent: number;
                hpMax: number;
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
            rewards: Reward[];
        };
        merchantItems?: MerchantItems;
        treasureData?: TreasureInterface;
        encounterData?: EncounterInterface;
    };

    @Prop({ type: Object })
    contest: Contest;

    @Prop({
        default: ExpeditionStatusEnum.InProgress,
        type: String,
        enum: ExpeditionStatusEnum,
    })
    status: ExpeditionStatusEnum;

    @Prop({ default: false })
    isCurrentlyPlaying: boolean;

    @Prop()
    currentStage: number;

    @Prop()
    stageScores: ScoreResponse[];

    @Prop()
    createdAt: Date;

    @Prop()
    /**
     * @Deprecated use endedAt instead
     */
    defeatedAt?: Date;

    @Prop()
    /**
     * @Deprecated use endedAt instead
     */
    completedAt?: Date;

    @Prop()
    endedAt?: Date;
}
