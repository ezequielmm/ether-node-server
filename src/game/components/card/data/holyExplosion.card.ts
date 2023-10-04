import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO:
-for both cards
    -energy x (?)
    -cards effects

*/

export const HolyExplosionCardUpgraded: Card = {
    cardId: 560,
    name: 'Holy Explosion+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal X + 5 ${damageEffect.name} and inflict X + 3 ${burn.name} to all Undead enemies. Deal X + 3 ${damageEffect.name} and inflict 3 ${burn.name} to all other enemies. `,
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
            //more effects shoud go here
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const HolyExplosionCard: Card = {
    cardId: 559,
    name: 'Holy Explosion',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal X + 3 damage and inflict 3 burn to all Undead enemies and Deal X + 3 damage and inflict 3 burn to all other enemies.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: HolyExplosionCardUpgraded.cardId,
    isActive: true,
};
