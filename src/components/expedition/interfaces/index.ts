import { ExpeditionMapNodeTypeEnum } from '../enums';
import { CardRarityEnum, CardTypeEnum } from '../../card/enums';

export interface IExpeditionMap {
    act: number;
    step: number;
    id: number;
    type: ExpeditionMapNodeTypeEnum;
    exits: number[];
    enter: number[];
    private_data: any;
}

export interface IExpeditionPlayerState {
    player_name: string;
    character_class: string;
    hp_max: number;
    hp_current: number;
    gold: number;
    potions: any;
    trinkets: [];
    deck: {
        cards: IExpeditionPlayerStateDeckCard[];
    };
    created_at: Date;
    stopped_at: Date;
}

export interface IExpeditionPlayerStateDeckCard {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly rarity: CardRarityEnum;
    readonly energy: number;
    readonly type: CardTypeEnum;
    readonly coin_min: number;
    readonly coin_max: number;
}
