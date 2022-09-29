import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { doubleBurn } from 'src/game/effects/doubleBurn/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';



export const KindleCardUpgraded: Card = {
    cardId: 92,
    name: 'Kindle+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Apply {${doubleBurn.name}} Burn\nDouble any Burn on all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                    statusName: burn.name,
                    statusArgs: {
                        counter: 2,
                    },
                },
            },
            {
                effect: doubleBurn.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [
            // {
            //     name: burn.name,
            //     attachTo: CardTargetedEnum.Enemy,
            //     args: {
            //         counter: 2,
            //     },
            // },
        ],
    },
    showPointer: true,
    isUpgraded: true,
};

export const KindleCard: Card = {
    cardId: 91,
    name: 'Kindle',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Apply {${doubleBurn.name}} Burn\nDouble any Burn on all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                    statusName: burn.name,
                    statusArgs: {
                        counter: 1,
                    },
                },
            },
            {
                effect: doubleBurn.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [],
        // statuses: [
        //     {
        //         name: burn.name,
        //         attachTo: CardTargetedEnum.Enemy,
        //         args: {
        //             counter: 1,
        //         },
        //     },
        // ],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: KindleCardUpgraded.cardId,
};
