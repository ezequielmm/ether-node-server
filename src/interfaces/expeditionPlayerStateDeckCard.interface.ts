import { CardRarityEnum, CardTypeEnum } from '@prisma/client';

export interface ExpeditionPlayerStateDeckCardInterface {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly rarity: CardRarityEnum;
    readonly energy: number;
    readonly type: CardTypeEnum;
    readonly coin_min: number;
    readonly coin_max: number;
}
