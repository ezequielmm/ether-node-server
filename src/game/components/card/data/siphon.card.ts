import { siphoning } from 'src/game/status/siphoning/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const SiphonCard: Card = {
    cardId: 77,
    name: 'Siphon',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description:
        'For the rest of this turn, gain defense equal to damage dealt.',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: siphoning.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const SiphonCardUpgraded: Card = {
    cardId: 78,
    name: 'Siphon+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description:
        'For the rest of this turn, gain defense equal to damage dealt.',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: siphoning.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
