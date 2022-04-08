import { CardRarityEnum, CardTypeEnum } from '@prisma/client';

export interface ExpeditionDeckCardInterface {
    id: string;
    name: string;
    description: string;
    rarity: CardRarityEnum;
    energy: number;
    type: CardTypeEnum;
    coin_min: number;
    coin_max: number;
}
