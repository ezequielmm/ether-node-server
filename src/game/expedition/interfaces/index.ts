import {
    ExpeditionCurrentNodeDataPlayerStatusEnum,
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../enums';
import { Card } from 'src/game/components/card/card.schema';
import {
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyTypeEnum,
} from 'src/game/components/enemy/enums';

export interface IExpeditionNode {
    readonly id: number;
    readonly act: number;
    readonly step: number;
    readonly isActive: boolean;
    readonly isDisable: boolean;
    readonly isAvailable: boolean;
    readonly isComplete: boolean;
    readonly type: ExpeditionMapNodeTypeEnum;
    readonly subType: ExpeditionMapNodeTypeEnum;
    readonly status: ExpeditionMapNodeStatusEnum;
    readonly exits: Array<number>;
    readonly enter: Array<number>;
    readonly private_data: any;
    state?: any;
}

export interface IExpeditionPlayerState {
    player_name: string;
    character_class: string;
    hp_max: number;
    hp_current: number;
    gold: number;
    potions: any;
    trinkets?: [];
    deck: {
        cards: IExpeditionPlayerStateDeckCard[];
    };
    created_at: Date;
    stopped_at?: Date;
}

export interface IExpeditionPlayerStateDeckCard extends Card {
    id: string;
    is_temporary: boolean;
}

export interface IExpeditionCurrentNode {
    node_id?: number;
    node_type?: ExpeditionMapNodeTypeEnum;
    data?: IExpeditionCurrentNodeData;
    completed?: boolean;
}

export interface IExpeditionCurrentNodeData {
    round?: number;
    action?: number;
    player?: IExpeditionCurrentNodeDataPlayer;
    enemies?: IExpeditionCurrentNodeDataEnemy[];
}

export interface IExpeditionCurrentNodeDataPlayer {
    energy?: number;
    energy_max?: number;
    hand_size?: number;
    defense?: number;
    cards: {
        hand?: IExpeditionPlayerStateDeckCard[];
        draw?: IExpeditionPlayerStateDeckCard[];
        discard?: IExpeditionPlayerStateDeckCard[];
        exhausted?: IExpeditionPlayerStateDeckCard[];
    };
    status?: ExpeditionCurrentNodeDataPlayerStatusEnum;
}

export interface IExpeditionCurrentNodeDataEnemy {
    id: string;
    defense: number;
    enemyId: number;
    name: string;
    type: EnemyTypeEnum;
    category: EnemyCategoryEnum;
    size: EnemySizeEnum;
    hpMin: 9;
    hpMax: 12;
}
