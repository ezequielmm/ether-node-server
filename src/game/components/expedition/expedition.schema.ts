import { modelOptions, Prop } from '@typegoose/typegoose';
import { HydratedDocument } from 'mongoose';
import { MerchantItems } from 'src/game/merchant/merchant.interface';
import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { TreasureInterface } from 'src/game/treasure/treasure.interfaces';
import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
    ExpeditionStatusEnum,
} from './expedition.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionPlayerStateDeckCard,
    Player,
    Reward,
} from './expedition.interface';
import { ExpeditionActConfig } from './expeditionActConfig.schema';
import { EncounterInterface } from '../encounter/encounter.interfaces';

export type ExpeditionDocument = HydratedDocument<Expedition>;

@modelOptions({
    schemaOptions: { collection: 'expeditions', versionKey: false },
})
export class Expedition {
    @Prop()
    clientId?: string;

    @Prop()
    playerId: number;

    @Prop()
    actConfig?: ExpeditionActConfig;

    @Prop()
    mapSeedId?: number;

    @Prop()
    map: IExpeditionNode[];

    @Prop()
    playerState: Player;

    @Prop({ type: Object })
    currentNode?: {
        nodeId: number;
        nodeType: ExpeditionMapNodeTypeEnum;
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

    @Prop({
        default: ExpeditionStatusEnum.InProgress,
        type: String,
        enum: ExpeditionStatusEnum,
    })
    status: ExpeditionStatusEnum;

    @Prop({ default: false })
    isCurrentlyPlaying: boolean;
}
