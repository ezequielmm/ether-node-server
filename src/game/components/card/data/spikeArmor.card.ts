import { damageEffect } from 'src/game/effects/damage/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const SpikeArmorCard: Card = {
    cardId: 70,
    name: 'Spike Armor',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Whenever you are attacked, deal {${damageEffect.name}} damage back to attacker`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: spikesStatus.name,
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 3,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const SpikeArmorCardUpgraded: Card = {
    cardId: 71,
    name: 'Spike Armor+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Whenever you are attacked, deal {${damageEffect.name}} damage back to attacker`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: spikesStatus.name,
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 5,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
