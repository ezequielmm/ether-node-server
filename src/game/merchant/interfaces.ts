import { ItemsTypeEnum } from './merchant.enum';

export interface Item {
    isSale?: boolean;
    id: string;
    cost: number;
    isSold: boolean;
    itemId: number;
}

export interface FindOneMerchantDTO {
    itemId?: number;
}
export interface ItemId {
    id: number | string;
}

export interface selectedItem {
    targetId: number | string;
    type:
        | ItemsTypeEnum.Upgrade
        | ItemsTypeEnum.Destroy
        | ItemsTypeEnum.Card
        | ItemsTypeEnum.Potion
        | ItemsTypeEnum.Trinket;
}
