import { damageEffect } from 'src/game/effects/damage/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const LungeCardUpgraded: Card = {
    cardId: 14,
    name: 'Lunge+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage twice.\nDraw {${drawCardEffect.name}} cards`,
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
    isActive: false,
};

export const LungeCard: Card = {
    cardId: 13,
    name: 'Lunge',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage twice.\nDraw {${drawCardEffect.name}} card`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 2,
                args: {
                    value: 4,
                },
            },
            
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: LungeCardUpgraded.cardId,
    isActive: false,
};
