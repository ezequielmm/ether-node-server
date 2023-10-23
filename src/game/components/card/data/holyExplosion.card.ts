import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardEnergyEnum } from '../card.enum';
import { Card } from '../card.schema';
import { holyExplosion } from 'src/game/effects/holyExplosion/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

export const HolyExplosionCardUpgraded: Card = {
    cardId: 560,
    name: 'Holy Explosion+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Inflict 7 ${burn.name} to target and deal X x 5 ${damageEffect.name} to all enemies. Inflict an additional X + 5 ${damageEffect.name} to all Undead enemies other enemies.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: holyExplosion.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    undeadDamage: 5,
                    allEnemiesDamage: 5,
                },
            },           
        ],
        statuses: [
            {
                name: burn.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 7,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const HolyExplosionCard: Card = {
    cardId: 559,
    name: 'Holy Explosion',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Inflict 5 ${burn.name} to target and deal X x 3 ${damageEffect.name} to all enemies. Inflict an additional X + 3 ${damageEffect.name} to all Undead enemies.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: holyExplosion.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    undeadDamage: 3,
                    allEnemiesDamage: 3,
                },
            },        
            // {
            //     effect: attachStatusEffect.name,
            //     target: CardTargetedEnum.AllEnemies,
            //     args: {
            //         value: 3,
            //         statusName: burn.name,
            //         statusArgs: {
            //             counter: 3,
            //         },
            //     }
            // }
        ],
        statuses: [
            {
                name: burn.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 5,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
    upgradedCardId: HolyExplosionCardUpgraded.cardId,
    isActive: true,
};
