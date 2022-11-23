import { damageEffect } from 'src/game/effects/damage/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const LungeCardUpgraded: Card = {
    cardId: 14,
    name: 'Lunge+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} damage twice.\nDraw {${drawCardEffect.name}} cards`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 2,
                args: {
                    value: 4,
                },
            },
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
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const LungeCard: Card = {
    cardId: 13,
    name: 'Lunge',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} damage twice.\nDraw {${drawCardEffect.name}} card`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 2,
                args: {
                    value: 4,
                },
            },
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: LungeCardUpgraded.cardId,
    isActive: true,
};
