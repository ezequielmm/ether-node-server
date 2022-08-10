import { energyEffect } from 'src/game/effects/energy/constants';
import { drained } from 'src/game/status/drained/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BlusterCard: Card = {
    cardId: 63,
    name: 'Bluster',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${energyEffect.name}} energy. Start next turn with {${drained.name}} less energy.`,
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
        statuses: [
            {
                name: drained.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const BlusterCardUpgraded: Card = {
    cardId: 64,
    name: 'Bluster+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${energyEffect.name}} energy. Start next turn with {${drained.name}} less energy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                },
            },
        ],
        statuses: [
            {
                name: drained.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
