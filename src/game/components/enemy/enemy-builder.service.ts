import { Injectable } from "@nestjs/common";
import { damageEffect } from "src/game/effects/damage/constants";
import { CardTargetedEnum } from "../card/card.enum";
import { EnemyIntentionType } from "./enemy.enum";
import { EnemyIntention } from "./enemy.interface";
import { defenseEffect } from "src/game/effects/defense/constants";
import { attachStatusEffect } from "src/game/effects/attachStatus/constants";
import { spawnEnemyEffect } from "src/game/effects/spawnEnemy/contants";
import { noEffect } from "src/game/effects/noEffects/constants";

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
                        name: 'attack1',
                        hint: 'attack1',
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
                        name: 'cast1',
                        hint: 'cast1',
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
                        name: 'cast1',
                        hint: 'cast1',
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
                        name: 'cast1',
                        hint: 'cast1',
                    },
                },
            ],
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
                        name: 'cast1',
                        hint: 'cast1',
                    },
                },
            ],
        }
    }

}