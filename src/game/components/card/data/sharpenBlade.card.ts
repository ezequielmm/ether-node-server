import { sharpenBlade } from 'src/game/status/sharpenBlade/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const SharpenBladeCard: Card = {
    cardId: 55,
    name: 'Sharpen Blade',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 2,
    description: `Start each turn with {${sharpenBlade.name}} Fine Edge card.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: sharpenBlade.name,
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

export const SharpenBladeCardUpgraded: Card = {
    cardId: 56,
    name: 'Sharpen Blade',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 2,
    description: `Start each turn with {${sharpenBlade.name}} Fine Edge card.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: sharpenBlade.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    counter: 1,
                    upgraded: true,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};
