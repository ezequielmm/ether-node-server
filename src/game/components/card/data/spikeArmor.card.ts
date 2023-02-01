/*

import { damageEffect } from 'src/game/effects/damage/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

const spikeArmorDamage = 3;
const spikeArmorUpgradedDamage = 5;

export const SpikeArmorCardUpgraded: Card = {
    cardId: 70,
    name: 'Spiked Armor+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Give ${spikeArmorUpgradedDamage} spikes`,
    keywords: [],
    properties: {
        effects: [
            {
                // Effect only used to process the card description
                effect: damageEffect.name,
                // Target set to None
                target: CardTargetedEnum.None,
                args: {
                    value: spikeArmorUpgradedDamage,
                },
            },
        ],
        statuses: [
            {
                name: spikesStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: spikeArmorUpgradedDamage,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const SpikeArmorCard: Card = {
    cardId: 69,
    name: 'Spiked Armor',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Give ${spikeArmorDamage} spikes`,
    keywords: [],
    properties: {
        effects: [
            {
                // Effect only used to process the card description
                effect: damageEffect.name,
                // Target set to None
                target: CardTargetedEnum.None,
                args: {
                    value: spikeArmorDamage,
                },
            },
        ],
        statuses: [
            {
                name: spikesStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: spikeArmorDamage,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: SpikeArmorCardUpgraded.cardId,
    isActive: false,
};
*/
