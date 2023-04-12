import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from '../components/expedition/expedition.interface';
import { Trinket } from '../components/trinket/trinket.schema';
import { ItemsTypeEnum } from './merchant.enum';

export interface Item {
    isSale?: boolean;
    id: string;
    isSold: boolean;
    itemId: number;
    cost: number;
    type: ItemsTypeEnum;
    item: IExpeditionPlayerStateDeckCard | PotionInstance | Trinket;
}

export interface FindOneMerchantDTO {
    itemId?: number;
}
export interface ItemId {
    id: number | string;
}

export interface SelectedItem {
    targetId: number | string;
    type: ItemsTypeEnum;
}

export interface MerchantItems {
    potions: Item[];
    cards: Item[];
    trinkets: Item[];
    upgradeCost?: number;
    destroyCost?: number;
}
