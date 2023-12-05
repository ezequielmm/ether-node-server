
import { elementalStatus } from 'src/game/status/elemental/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { elementalAttackStatus } from 'src/game/status/elementalattack/constants';

export const SpiritualAssaultCardUpgraded: Card = {
    cardId: 569,
    name: 'Spiritual Assault+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `All physical attacks deal ethereal damage this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: elementalAttackStatus.name,
                attachTo: CardTargetedEnum.Self,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const SpiritualAssaultCard: Card = {
    cardId: 568,
    name: 'Spiritual Assault',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `All physical attacks deal ethereal damage this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
                {
                    name: elementalAttackStatus.name,
                    attachTo: CardTargetedEnum.Self,
                    args: {
                        counter: 1,
                    },
                },
            ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: SpiritualAssaultCardUpgraded.cardId,
    isActive: true,
};
