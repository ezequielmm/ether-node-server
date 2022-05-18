import {
    ExpeditionCurrentNodeDataPlayerStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../enums';
import { Card } from 'src/game/components/card/card.schema';

export interface IExpeditionMap {
    act: number;
    step: number;
    id: number;
    type: ExpeditionMapNodeTypeEnum;
    exits: number[];
    enter: number[];
    private_data?: any;
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
    node_type?: string;
    data?: IExpeditionCurrentNodeData;
    completed?: boolean;
}

export interface IExpeditionCurrentNodeData {
    round?: number;
    action?: number;
    player?: IExpeditionCurrentNodeDataPlayer;
}

export interface IExpeditionCurrentNodeDataPlayer {
    energy?: number;
    energy_max?: number;
    hand_size?: number;
    cards?: {
        hand?: IExpeditionPlayerStateDeckCard[];
        draw?: IExpeditionPlayerStateDeckCard[];
        discard?: IExpeditionPlayerStateDeckCard[];
        exhausted?: IExpeditionPlayerStateDeckCard[];
    };
    status?: ExpeditionCurrentNodeDataPlayerStatusEnum;
}
