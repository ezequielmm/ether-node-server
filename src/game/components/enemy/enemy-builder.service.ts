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
import { grownStatus } from "src/game/status/grown/constants";
import { counteringStatus } from "src/game/status/countering/constants";
import { addConditionalCardEffect } from "src/game/effects/addConditionalCard/constants";
import { absorbingStatus } from "src/game/status/absorbing/constants";

export class EnemyBuilderService {

    public static ATTACK                         = "attack";
    public static ATTACK2                        = "attack_2";
    public static ATTACK_SWORD                   = "attack_sword";
    public static ATTACK_SWORD_BUFF              = "attack_sword_buff";
    public static ATTACK_ARROW_DEBUFF            = "attack_arrow_debuff";
    public static ATTACK_ARROW_DEBUFF2           = "attack_arrow_debuff_2";
    public static ATTACK_HIDDEN                  = "attack_hidden_2";
    public static ATTACK_POISON                  = "attack_poison";
    public static POISON                         = "posion";
    public static DEFEND                         = "defend";
    public static BUFF                           = "buff";
    public static BUFF2                          = "buff_2";
    public static DEBUFF                         = "debuff";
    public static DEBUFF2                        = "debuff2";
    public static DEBUFF3                        = "debuff3";
    public static SPECIAL                        = "special";
    public static SIGNATURE_MOVE                 = "signature_move";
    public static ATTACK_BUFF                    = "attack_buff";
    public static ATTACK_DEBUFF                  = "attack_debuff";
    public static ATTACK_DEBUFF2                 = "attack_debuff_2";
    public static ATTACK_DEBUFF3                 = "attack_debuff_2";
    public static DEFEND_BUFF                    = "defend_buff";
    public static DEFEND_DEBUFF                  = "defend_debuff";
    public static SPECIAL_ATTACK                 = "special_attack";
    public static SIGNATURE_DEBUFF               = "signature_attack_debuff";
    public static COUNTER                        = "counter";
    public static COUNTER_DEFEND                 = "counter_defend";
    public static INFECT                         = "infect";
    public static INFECT_ATTACK_SWORD            = "infect_attack_sword";
    public static INFECT_ATTACK                  = "infect_attack";
    public static BRECH                          = "breach";
    public static GROW                           = "grow";
    public static DODGE                          = "dodge";
    public static MISTIFY                        = "mistify";
    public static MISTIFY2                       = "mistify2";
    public static ABSORB                         = "absorb";
    public static ABSORB_DEFEND                  = "absorb_defend";
    public static COUNTER_BUFF                   = "counter_buff";
    public static CALL_FOR_REINFORCEMENTS        = "call_for_reinforcements";
    public static CALL_FOR_REINFORCEMENTS2       = "call_for_reinforcements2";
    public static ABSORB_CALL_FOR_REINFORCEMENTS = "absorb_call_for_reinforcements";
    public static SUMMON                         = "summon";
    public static SUMMON2                        = "summon_2";
    public static SUMMON3                        = "summon_3";
    public static SUMMON4                        = "summon_4";
    public static ATTACK_THUNDER_RED_DEBUF       = "attack_thunder_red_debuff";
    public static ATTACK_THUNDER_GREEN_DEBUFF2   = "attack_thunder_green_debuff_2";
    
    public static createBasicAttackIntent = (attack:number, animationId: string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createBreachAttack = (breach:number, animationId: string): EnemyIntention => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createCounterAttack = (animationId: string): EnemyIntention => {
        return {
            type: EnemyIntentionType.Counter,
            target: CardTargetedEnum.Self,
            value: 1,
            effects: [
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        statusName: counteringStatus.name,
                        statusArgs: {
                            counter: 1,
                        },
                    },
                    action: {
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createAbsorbAttack = (animationId: string): EnemyIntention => {
        return {
            type: EnemyIntentionType.Absorb,
            target: CardTargetedEnum.Self,
            value: 1,
            effects: [
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        statusName: absorbingStatus.name,
                        statusArgs: {
                            counter: 1,
                        },
                    },
                    action: {
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createMultiplierAttackIntent = (attack:number, multiplier:number, animationId: string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createDefenseIntent = (defense:number, animationId: string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
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

    public static createBasicBuffIntent = (value:number, name:string, animationId:string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createBasicDebuffIntent = (value:number, name:string, animationId:string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createAddCardIntent = (amount:number, card:Card, destination: CardDestinationEnum, animationId:string):EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                }
            ]
        }
    }

    public static createMistifyAction = (amount:number, animationId:string) => {
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
                        name: animationId,
                        hint: animationId,
                    },
                }
            ]
        }
    }

    public static invokeMinionsIntent = (enemies: number[], animationId:string): EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static callForReinforcements = (enemies: number[], animationId:string): EnemyIntention  => {
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
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }

    public static createInfectIntent = (damage:number, decayAmount:number, animationId:string) => {
        return {
            type: EnemyIntentionType.Infect,
            target: CardTargetedEnum.Player,
            value: damage,
            effects: [
                {
                    effect: addConditionalCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: decayAmount,
                        cardId: DecayCard.cardId,     
                        destination: CardDestinationEnum.Draw,
                        position: AddCardPosition.Random,
                        damage
                    },
                    action: {
                        name: animationId,
                        hint: animationId,
                    },
                },
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: damage,
                    },
                    action: {
                        name: animationId,
                        hint: animationId,
                    },
                },
            ],
        }
    }


    public static createGrowIntent = (healAmount: number, negateDamage: number, growAmount:number, animationId:string) => {
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
                        name: animationId,
                        hint: animationId
                    }
                },
                {
                    effect: attachStatusEffect.name,
                    target: CardTargetedEnum.Self,
                    args: {
                        statusName: grownStatus.name,
                        statusArgs: {
                            counter: growAmount,
                        },
                    },
                    action:{
                        name: animationId,
                        hint: animationId
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

    public static createDwellerMonsterBeam = (beamAttack:number): EnemyIntention => {
        return {
            type: EnemyIntentionType.Attack,
            target: CardTargetedEnum.Player,
            value: beamAttack,
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: beamAttack,
                    },
                    action: {
                        name: 'laser',
                        hint: 'laser',
                    },
                },
            ],
        }
    }

}
