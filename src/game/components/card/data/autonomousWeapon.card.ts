import { autonomousWeaponEffect } from 'src/game/effects/autonomousWeapon/constants';
import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const AutonomousWeaponCardUpgraded: Card = {
    cardId: 146,
    name: 'Autonomous Weapon+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 3,
    description: `Deal {${40}} + {${resolveStatus.name}} damage. This card shuffles back into your draw pile.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: autonomousWeaponEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: null,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
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
    cardId: 145,
    name: 'Autonomous Weapon',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 3,
    description: `Deal {${30}} + {${resolveStatus.name}} damage. This card shuffles back into your draw pile.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: autonomousWeaponEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: null,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 30,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: AutonomousWeaponCardUpgraded.cardId,
    isActive: true,
};
