import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const RecoverCardUpgraded: Card = {
    cardId: 44,
    name: 'Recover+',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Draw {${drawCardEffect.name}} cards. If an enemy is Confused, {p:${drawCardEffect.name}:they cost:it costs} 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                    useEnemiesConfusedAsCost: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const RecoverCard: Card = {
    cardId: 43,
    name: 'Recover',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Draw {${drawCardEffect.name}} cards. If an enemy is Confused, {p:${drawCardEffect.name}:they cost:it costs} 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    useEnemiesConfusedAsCost: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: RecoverCardUpgraded.cardId,
    isActive: true,
};
