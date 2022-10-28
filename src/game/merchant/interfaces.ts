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
    id: number | string;
    type:
        | 'cards'
        | 'neutralCards'
        | 'trinkets'
        | 'potions'
        | 'destroy'
        | 'upgrade';
}
