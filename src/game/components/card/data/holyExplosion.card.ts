import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardEnergyEnum } from '../card.enum';
import { Card } from '../card.schema';
import { holyExplosion } from 'src/game/effects/holyExplosion/constants';

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
                effect: holyExplosion.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    undeadDamage: 5,
                    notUndeadDamage: 3,
                    undeadBurn: 3,
                    notUndeadBurn: 3,
                },
            },           
        ],
        statuses: [],
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
    description: `Deal X + 3 ${damageEffect.name} and inflict 3 ${burn.name} to all Undead enemies and deal X + 2 ${damageEffect.name} and inflict 2 ${burn.name} to all other enemies.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: holyExplosion.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    unDeadDamage: 3,
                    notUndeadDamage: 2,
                    undeadBurn: 3,
                    notUndeadBurn: 2,
                },
            },        
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    upgradedCardId: HolyExplosionCardUpgraded.cardId,
    isActive: true,
};
