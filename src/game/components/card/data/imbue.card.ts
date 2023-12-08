import { imbued } from 'src/game/status/imbued/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ImbueCardUpgraded: Card = {
    cardId: 150,
    name: 'Imbue+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Your next card this turn is played twice`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: imbued.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const ImbueCard: Card = {
    cardId: 149,
    name: 'Imbue',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Your next card this turn is played twice`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: imbued.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: ImbueCardUpgraded.cardId,
    isActive: true,
};
