import { energyEffect } from 'src/game/effects/energy/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardKeywordEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const CharmedCard: Card = {
    cardId: 505,
    name: 'Charmed',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 1,
    description: `Lose {${energyEffect.name}} Energy when drawn. Fade`,
    keywords: [CardKeywordEnum.Fade],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: -1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
