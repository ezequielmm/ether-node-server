import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TorchCardUpgraded: Card = {
    cardId: 90,
    name: 'Torch+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} Damage. \nApply {${burn.name}} Burn`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [
            {
                name: burn.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 3,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const TorchCard: Card = {
    cardId: 89,
    name: 'Torch',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} Damage. \nApply {${burn.name}} Burn`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [
            {
                name: burn.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: TorchCardUpgraded.cardId,
};
