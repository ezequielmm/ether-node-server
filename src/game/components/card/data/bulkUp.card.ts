import { resolveStatus } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BulkUpCardUpgraded: Card = {
    cardId: 58,
    name: 'Bulk Up+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Gain {${resolveStatus.name}} Resolve`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 3,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const BulkUpCard: Card = {
    cardId: 57,
    name: 'Bulk Up',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 2,
    description: `Gain {${resolveStatus.name}} Resolve`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: BulkUpCardUpgraded.cardId,
    isActive: true,
};
