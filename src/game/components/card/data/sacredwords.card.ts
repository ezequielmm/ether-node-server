import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardEnergyEnum } from '../card.enum';
import { Card } from '../card.schema';
import { holyExplosion } from 'src/game/effects/holyExplosion/constants';
import { sacretwords } from 'src/game/status/sacredwords/constants';
//import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

export const SacretWordsCardUpgraded: Card = {
    cardId: 581,
    name: 'Sacred Words+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Shuffle enemy intents. `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacretwords.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    undeadDamage: 5,
                    undeadBurn: 3,
                    notUndeadDamage: 3,
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
    cardId: 580,
    name: 'Sacred Words',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Shuffle enemy intents. `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: sacretwords.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    undeadDamage: 3,
                    undeadBurn: 3,
                    notUndeadDamage: 2,
                    notUndeadBurn: 2,
                },
            },        
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: SacretWordsCardUpgraded.cardId,
    isActive: true,
};
