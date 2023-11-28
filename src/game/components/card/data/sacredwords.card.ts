import { damageEffect } from 'src/game/effects/damage/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardEnergyEnum } from '../card.enum';
import { Card } from '../card.schema';
import { sacredwords } from 'src/game/effects/sacredwords/constants';
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
                effect: sacredwords.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    shuffleTurns: 2,
                },
            },           
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const SacretWordsCard: Card = {
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
                effect: sacredwords.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    shuffleTurns : 1,
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
