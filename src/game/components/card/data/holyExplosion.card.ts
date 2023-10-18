import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardEnergyEnum } from '../card.enum';
import { Card } from '../card.schema';

export const HolyExplosionCardUpgraded: Card = {
    cardId: 560,
    name: 'Holy Explosion+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal X + 5 ${damageEffect.name} and inflict X + 3 ${burn.name} to all Undead enemies and deal X + 3 ${damageEffect.name} and inflict 3 ${burn.name} to all other enemies. `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 5,
                },
            },          
        ],
        statuses: [
            {
                name: burn.name,
                attachTo: CardTargetedEnum.AllEnemies,
                args: {
                    counter: 3,
                },
            } 
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
    description: `Deal X + 3 ${damageEffect.name} and inflict 3 ${burn.name} to all Undead enemies and deal X + 3 ${damageEffect.name} and inflict 3 ${burn.name} to all other enemies.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 3,
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
            }
        ],
    },
    showPointer: false,
    isUpgraded: true,
    upgradedCardId: HolyExplosionCardUpgraded.cardId,
    isActive: true,
};
