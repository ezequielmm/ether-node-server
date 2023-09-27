import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO:
- card type
- card effects

*/

export const HolyExplosionCard: Card = {
    cardId: 559,
    name: 'Holy Explosion',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
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
    isActive: true,
};
