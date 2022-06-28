import { CardDocument } from '../card/card.schema';
import { EnemyDocument } from '../enemy/enemy.schema';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionMapNodeStatusEnum,
} from './expedition.enum';

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
    readonly exits: number[];
    readonly enter: number[];
    readonly private_data: any;
    state?: any;
}

export interface IExpeditionPlayerStateDeckCard extends CardDocument {
    id: string;
    is_temporary: boolean;
}

export interface IExpeditionCurrentNodeDataEnemy extends EnemyDocument {
    effects: [];
}

export interface IExpeditionStatusResponse {
    readonly hasExpedition: boolean;
}
