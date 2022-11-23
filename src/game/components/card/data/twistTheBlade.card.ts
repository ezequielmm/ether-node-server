import { twistTheBlade } from 'src/game/effects/twistTheBlade/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TwistTheBladeCardUpgraded: Card = {
    cardId: 162,
    name: 'Twist the Blade+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal damage equal to your last attack.\nIf the enemy has defense, double the damage.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: twistTheBlade.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const TwistTheBladeCard: Card = {
    cardId: 161,
    name: 'Twist the Blade',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal damage equal to your last attack.\nIf the enemy has defense, double the damage.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: twistTheBlade.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: TwistTheBladeCardUpgraded.cardId,
    isActive: true,
};
