import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { CardSelectionScreenOriginPileEnum } from '../../cardSelectionScreen/cardSelectionScreen.enum';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BackflipCardUpgraded: Card = {
    cardId: 122,
    name: 'Backflip+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Choose {${chooseCardEffect.name}} card from your discard pile. It costs 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: chooseCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    originPile: CardSelectionScreenOriginPileEnum.Discard,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const BackflipCard: Card = {
    cardId: 121,
    name: 'Backflip',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Choose {${chooseCardEffect.name}} card from your discard pile. It costs 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: chooseCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    originPile: CardSelectionScreenOriginPileEnum.Discard,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: BackflipCardUpgraded.cardId,
    isActive: false,
};
