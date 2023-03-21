import { modelOptions, Prop, PropType, Severity } from '@typegoose/typegoose';
import { HydratedDocument } from 'mongoose';
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
import { Node } from './node';
import { Player } from './player';
import { ExpeditionActConfig } from './expeditionActConfig.schema';
import { EncounterInterface } from '../encounter/encounter.interfaces';
import { Score } from './scores';
import { ScoreResponse } from 'src/game/scoreCalculator/scoreCalculator.service';
import { Gear } from '../gear/gear.schema';
import { PlayerWinInfo } from "../../../playerWin/playerWin.schema";

export type ExpeditionDocument = HydratedDocument<Expedition>;

@modelOptions({
    schemaOptions: { collection: 'expeditions', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Expedition {
    @Prop()
    clientId?: string;

    @Prop()
    playerId: number;

    @Prop()
    actConfig?: ExpeditionActConfig;

    @Prop()
    scores?: Score;

    @Prop()
    mapSeedId?: number;

    @Prop({ type: () => [Node] }, PropType.ARRAY)
    map: Node[];

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

    @Prop({ type: Object }) contest: PlayerWinInfo;

    @Prop({
        default: ExpeditionStatusEnum.InProgress,
        type: String,
        enum: ExpeditionStatusEnum,
    })
    status: ExpeditionStatusEnum;

    @Prop({ default: false })
    isCurrentlyPlaying: boolean;

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
