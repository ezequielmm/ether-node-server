import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
    TrinketInstance,
} from '../components/expedition/expedition.interface';
import { ItemsTypeEnum } from './merchant.enum';

export interface Item {
    isSale?: boolean;
    id: string;
    isSold: boolean;
    itemId: number;
    cost: number;
    type: ItemsTypeEnum;
    item: IExpeditionPlayerStateDeckCard | PotionInstance | TrinketInstance;
}

export interface FindOneMerchantDTO {
    itemId?: number;
}
export interface ItemId {
    id: number | string;
}

export interface selectedItem {
    targetId: number | string;
    type: ItemsTypeEnum;
}

export interface MerchantItems {
    potions: Item[];
    cards: Item[];
    trinkets: Item[];
}
