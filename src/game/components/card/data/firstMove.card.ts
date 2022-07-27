import { energyEffect } from 'src/game/effects/energy/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const FirstMoveCard: Card = {
    cardId: 9,
    name: 'First Move',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Gain {${energyEffect.name}} Energy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const FirstMoveCardUpgraded: Card = {
    cardId: 10,
    name: 'First Move+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${energyEffect.name}} Energy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};
