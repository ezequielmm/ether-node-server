import {
    ExpeditionCurrentNodeDataPlayerStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../enums';
import { Card } from 'src/game/components/card/card.schema';

export interface IExpeditionMap {
    readonly act: number;
    readonly step: number;
    readonly id: number;
    readonly type: ExpeditionMapNodeTypeEnum;
    readonly exits: number[];
    readonly enter: number[];
    readonly private_data?: any;
}

export interface IExpeditionPlayerState {
    readonly player_name: string;
    readonly character_class: string;
    readonly hp_max: number;
    readonly hp_current: number;
    readonly gold: number;
    readonly potions: any;
    readonly trinkets?: [];
    readonly deck: {
        readonly cards: IExpeditionPlayerStateDeckCard[];
    };
    readonly created_at: Date;
    readonly stopped_at?: Date;
}

export interface IExpeditionPlayerStateDeckCard extends Card {
    readonly id: string;
}

export interface IExpeditionCurrentNode {
    readonly node_id?: number;
    readonly node_type?: string;
    readonly data?: IExpeditionCurrentNodeData;
    readonly completed?: boolean;
}

export interface IExpeditionCurrentNodeData {
    readonly round?: number;
    readonly action?: number;
    readonly player?: IExpeditionCurrentNodeDataPlayer;
}

export interface IExpeditionCurrentNodeDataPlayer {
    readonly energy?: number;
    readonly energy_max?: number;
    readonly hand_size?: number;
    readonly cards?: {
        hand?: IExpeditionPlayerStateDeckCard[];
        draw?: IExpeditionPlayerStateDeckCard[];
        discard?: IExpeditionPlayerStateDeckCard[];
        exhausted?: IExpeditionPlayerStateDeckCard[];
    };
    status?: ExpeditionCurrentNodeDataPlayerStatusEnum;
}
