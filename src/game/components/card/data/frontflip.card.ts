import { TakeCardFromPileEnum } from 'src/game/effects/chooseCard/chooseCard.effect';
import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const FrontflipCard: Card = {
    cardId: 123,
    name: 'Frontflip',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Choose {${chooseCardEffect.name}} card from your draw pile. It costs 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: chooseCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    takeFromPile: TakeCardFromPileEnum.Draw,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const FrontflipCardUpgraded: Card = {
    cardId: 124,
    name: 'Frontflip+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Choose {${chooseCardEffect.name}} card from your draw pile. It costs 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: chooseCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    takeFromPile: TakeCardFromPileEnum.Draw,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};
