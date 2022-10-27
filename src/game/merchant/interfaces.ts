export interface Item {
    isSale?: boolean;
    id: number | string;
    cost: number;
    isSold: boolean;
}

export interface FindOneMerchantDTO {
    itemId?: number;
}
export interface ItemId {
    id: number | string;
}

export interface selectedItem {
    id: number | string;
    type:
        | 'cards'
        | 'neutral_cards'
        | 'trinkets'
        | 'potions'
        | 'destroy'
        | 'upgrade';
}
