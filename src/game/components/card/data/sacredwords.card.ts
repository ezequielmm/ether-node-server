import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';
import { sacredWordEffect } from 'src/game/effects/sacredWords/constants';

export const SecretWordsCardUpgraded: Card = {
    cardId: 581,
    name: 'Secret Words+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 3,
    description: `Deal {${damageEffect.name}} damage. This card shuffles back into your draw pile.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacredWordEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: null,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 40,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const AutonomousWeaponCard: Card = {
    cardId: 580,
    name: 'Secret Words',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 3,
    description: `Deal {${damageEffect.name}} damage. This card shuffles back into your draw pile.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacredWordEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: null,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 30,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: SecretWordsCardUpgraded.cardId,
    isActive: true,
};
