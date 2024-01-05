import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';
import { sacredWordEffect } from 'src/game/effects/sacredWordsEffect/constants';
import { DodgeStatus } from 'src/game/status/dodge/dodge.status';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { dodge } from 'src/game/status/dodge/constants';

export const SecretWordsCardUpgraded: Card = {
    cardId: 573,
    name: 'Sacred Words+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Gain {${resolveStatus.name}} Resolve\nGain {${dodge.name}} dodge\nDraw 2 cards. `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacredWordEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
            {
                name: dodge.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const SecretWordsCard: Card = {
    cardId: 572,
    name: 'Sacred Words',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Gain {${resolveStatus.name}} Resolve\nGain {${dodge.name}} dodge\nDraw 2 cards. `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacredWordEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: dodge.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: SecretWordsCardUpgraded.cardId,
    isActive: true,
};
