import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const KegChugCardUpgraded: Card = {
    cardId: 28,
    name: 'Keg Chug+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Draw {${drawCardEffect.name}} cards`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const KegChugCard: Card = {
    cardId: 27,
    name: 'Keg Chug',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Draw {${drawCardEffect.name}} cards`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: KegChugCardUpgraded.cardId,
    isActive: false,
};
