import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { MoldCard } from './mold.card';
import { AddCardPosition } from 'src/game/effects/effects.enum';

export const SmudgeCardUpgraded: Card = {
    cardId: 570,
    name: 'Smudge+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 15 ${defenseEffect.name}. Add 1 Mold Card to deck.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 20,
                },
            },
            {
                effect: addCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    cardId: MoldCard.cardId,
                    destination: 'draw',
                    position: AddCardPosition.Random,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const SmudgeCard: Card = {
    cardId: 569,
    name: 'Smudge',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 15 ${defenseEffect.name}. Add 1 Mold Card to deck.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 15,
                },
            },
            {
                effect: addCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    cardId: MoldCard.cardId,
                    destination: 'draw',
                    position: AddCardPosition.Random,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: SmudgeCardUpgraded.cardId,
    isActive: true,
};
