import { damageEffect } from "src/game/effects/damage/constants";
import { CardDestinationEnum, CardTargetedEnum } from "../card/card.enum";
import { EnemyIntentionType } from "./enemy.enum";
import { EnemyIntention } from "./enemy.interface";
import { defenseEffect } from "src/game/effects/defense/constants";
import { attachStatusEffect } from "src/game/effects/attachStatus/constants";
import { spawnEnemyEffect } from "src/game/effects/spawnEnemy/contants";
import { noEffect } from "src/game/effects/noEffects/constants";
import { breachEffect } from "src/game/effects/breach/constants";
import { addCardEffect } from "src/game/effects/addCard/contants";
import { AddCardPosition } from "src/game/effects/effects.enum";
import { Card } from "../card/card.schema";
import { revealStatus } from "src/game/status/reveal/constants";
import { DecayCard } from "../card/data/decay.card";
import { healEffect } from "src/game/effects/heal/constants";
import { MirageCard } from "../card/data/mirage.card";

export class EnemyBuilderService {
    
    public static createBasicAttackIntent = (attack:number):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Attack,
            target: CardTargetedEnum.Player,
            value: attack,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: attack,
                    },
                    action: {
                        name: 'attack',
                        hint: 'attack',
                    },
                },
            ],
        }
    }

    public static createBreachAttack = (breach:number): EnemyIntention => {
        return {
            type: EnemyIntentionType.Breach,
            target: CardTargetedEnum.Player,
            value: breach,
            effects: [
                {
                    effect: breachEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: breach,
                    },
                    action: {
                        name: 'breach',
                        hint: 'breach',
                    },
                },
            ],
        }
    }

    public static createCounterAttack = (): EnemyIntention => {
        return {
            type: EnemyIntentionType.Counter,
            target: CardTargetedEnum.Player,
            value: 0,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 0,
                    },
                    action: {
                        name: 'counter',
                        hint: 'counter',
                    },
                },
            ],
        }
    }

    public static createAbsorbAttack = (): EnemyIntention => {
        return {
            type: EnemyIntentionType.Absorb,
            target: CardTargetedEnum.Player,
            value: 0,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 0,
                    },
                    action: {
                        name: 'absorb',
                        hint: 'absorb',
                    },
                },
            ],
        }
    }

    public static createMultiplierAttackIntent = (attack:number, multiplier:number):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Attack,
            target: CardTargetedEnum.Player,
            value: attack,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: attack,
                        multiplier: multiplier,
                    },
                    action: {
                        name: 'attack2',
                        hint: 'attack2',
                    },
                },
            ],
        }
    }

    public static createDefenseIntent = (defense:number):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Defend,
            target: CardTargetedEnum.Self,
            value: defense,
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        value: defense,
                    },
                    action: {
                        name: 'defend',
                        hint: 'defend',
                    },
                },
            ],
        }
    }

    public static createDoNothingIntent = (): EnemyIntention => {
        return {
            type: EnemyIntentionType.DoNothing,
            target: CardTargetedEnum.Self,
            value: 0,
            effects: [
                {
                    effect: noEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        value: 0,
                    },
                },
            ],
        }
    }

    public static createBasicBuffIntent = (value:number, name:string):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Buff,
            target: CardTargetedEnum.Self,
            value: value,
            effects: [
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        statusName: name,
                        statusArgs: {
                            counter: value,
                        },
                    },
                    action: {
                        name: 'buff',
                        hint: 'buff',
                    },
                },
            ],
        }
    }

    public static createBasicDebuffIntent = (value:number, name:string):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Debuff,
            target: CardTargetedEnum.Player,
            value: value,
            effects: [
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        statusName: name,
                        statusArgs: {
                            counter: value,
                        },
                    },
                    action: {
                        name: 'debuff',
                        hint: 'debuff',
                    },
                },
            ],
        }
    }

    public static createAddCardIntent = (amount:number, card:Card, destination: CardDestinationEnum):EnemyIntention  => {
        return {
            type: EnemyIntentionType.Debuff,
            target: CardTargetedEnum.Player,
            value: amount,
            effects:[
                {
                    effect: addCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: amount,
                        cardId: card.cardId,     
                        destination: destination,
                        position: AddCardPosition.Random,
                    },
                    action: {
                        name: 'debuff',
                        hint: 'debuff',
                    },
                }
            ]
        }
    }

    public static createMistifyAction = (amount:number) => {
        return {
            type: EnemyIntentionType.Mistify,
            target: CardTargetedEnum.Player,
            value: amount,
            effects:[
                {
                    effect: addCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: amount,
                        cardId: MirageCard.cardId,     
                        destination: CardDestinationEnum.Draw,
                        position: AddCardPosition.Random,
                    },
                    action: {
                        name: 'mistify',
                        hint: 'mistify',
                    },
                }
            ]
        }
    }

    public static invokeMinionsIntent = (enemies: number[]): EnemyIntention  => {
        return {
            type: EnemyIntentionType.Special,
            target: CardTargetedEnum.Self,
            value: 1,
            effects: [
                {
                    effect: spawnEnemyEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        enemiesToSpawn: enemies,
                    },
                    action: {
                        name: 'call_for_reinforcements',
                        hint: 'call_for_reinforcements',
                    },
                },
            ],
        }
    }

    public static callForReinforcements = (enemies: number[]): EnemyIntention  => {
        return {
            type: EnemyIntentionType.Reinforcements,
            target: CardTargetedEnum.Self,
            value: 1,
            effects: [
                {
                    effect: spawnEnemyEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        enemiesToSpawn: enemies,
                    },
                    action: {
                        name: 'call_for_reinforcements',
                        hint: 'call_for_reinforcements',
                    },
                },
            ],
        }
    }

    public static createInfectIntent = (damage:number, decayAmount:number) => {
        return {
            type: EnemyIntentionType.Infect,
            target: CardTargetedEnum.Player,
            value: damage,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: damage,
                    },
                    action: {
                        name: 'infect',
                        hint: 'infect',
                    },
                },
                {
                    effect: addCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: decayAmount,
                        cardId: DecayCard.cardId,     
                        destination: CardDestinationEnum.Draw,
                        position: AddCardPosition.Random,
                    },
                    action: {
                        name: 'infect',
                        hint: 'infect',
                    },
                },
            ],
        }
    }


    public static createGrowIntent = (healAmount: number, negateDamage: number, growDamage:number) => {
        return {
            type: EnemyIntentionType.Grow,
            target: CardTargetedEnum.Player,
            negateDamage,
            value: healAmount,
            effects: [
                {
                    effect: healEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        value: healAmount
                    },
                    action:{
                        name: 'grow',
                        hint: 'grow'
                    }
                }
            ]

        }
    }
    


    //------------------------------------------------------Enemy Specifics:

    public static boobyTrapSpecial = () => {
        return {
            type: EnemyIntentionType.Special,
            target: CardTargetedEnum.Player,
            value: 3,
            effects: [
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        statusName: revealStatus.name,
                        statusArgs: {
                            counter: 3,
                        },
                    },
                    action: {
                        name: 'special',
                        hint: 'special',
                    },
                },
            ]
        }
    }

}
