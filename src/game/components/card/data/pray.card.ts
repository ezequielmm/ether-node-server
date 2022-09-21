import { fortitude } from 'src/game/status/fortitude/constants';
import { prayingStatus } from 'src/game/status/praying/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const PrayCard: Card = {
    cardId: 23,
    name: 'Pray',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `At the beginning of your next turn gain 1 <color=#0066cc>Resolve</color> and 1 <color=#0066cc>Fortitude</color>`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: prayingStatus.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const PrayCardUpgraded: Card = {
    cardId: 24,
    name: 'Pray+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `At the beginning of your next two tu267733rns gain 1 <color=#0066cc>Resolve</color> and 1 <color=#0066cc>Fortitude</color>`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: prayingStatus.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};
