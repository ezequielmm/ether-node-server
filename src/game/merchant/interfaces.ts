import { Card } from '../components/card/card.schema';
import { Potion } from '../components/potion/potion.schema';
import { Trinket } from '../components/trinket/trinket.schema';

export interface Item {
    isSale?: boolean;
    itemId?: number;
    _id: string;
    item: Card | Trinket | Potion;
    coin: number;
    type: 'cards' | 'neutral_cards' | 'trinkets' | 'potions';
}

export interface FindOneMerchantDTO {
    itemId?: number;
}

export interface selectedItem {
    id: number | string;
    type: 'cards' | 'neutral_cards' | 'trinkets' | 'potions';
}
