import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_AFTER_DAMAGE_EFFECT } from 'src/game/constants';
import { isNotUndefined } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { energyEffect } from '../energy/constants';
import { damageEffect } from './constants';
import { EnemyIntentionType } from 'src/game/components/enemy/enemy.enum';
import { EnemyBuilderService } from 'src/game/components/enemy/enemy-builder.service';
import { StandardResponse, SWARMessageType, SWARAction } from 'src/game/standardResponse/standardResponse';
import { absorbEffect } from '../absorb/constants';
import { counterEffect } from '../counter/constants';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionEntity, GameContext } from 'src/game/components/interfaces';
import { trollData } from 'src/game/components/enemy/data/troll.enemy';
import { swarmMasterData } from 'src/game/components/enemy/data/swarmMaster.enemy';
import { deepDwellerLureData } from 'src/game/components/enemy/data/deepDwellerLure.enemy';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { deepDwellerMonsterData } from 'src/game/components/enemy/data/deepDwellerMonster.enemy';
import { StatusService } from 'src/game/status/status.service';
import { AttachDTO, AttachedStatus } from 'src/game/status/interfaces';
import { mossySkeletonData } from 'src/game/components/enemy/data/mossySkeleton.enemy';
import { mossyBonesData } from 'src/game/components/enemy/data/mossyBones.enemy';
import { mossyArcherData } from 'src/game/components/enemy/data/mossyArcher.enemy';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
    useEnergyAsValue?: boolean;
    useEnergyAsMultiplier?: boolean;
    onARoll?: {
        energyToRestore: number;
    };
    type?: string;
    statusIgnoreForRemove?: boolean;
    doubleValuesWhenPlayed?:boolean;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly effectService: EffectService,
        private readonly getEnergyAction: GetEnergyAction,
        private readonly statusService: StatusService,
    ) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            source,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
                onARoll,
            },
            action,
        } = payload;
        
        let ctx = payload.ctx;

        const {
            value: {
                combatState: { energy, defense },
            },
        } = this.playerService.get(ctx);

        const enemies = payload.ctx.expedition.currentNode.data.enemies;

        let oldHp = 0;
        let newHp = 0;
        let oldDefense = 0;
        let newDefense = 0;

        // Check targeted type
        if (EnemyService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player or
            // the current amount of defense that the player has
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

            oldHp = target.value.hpCurrent;
            oldDefense = target.value.defense;

            await this.enemyService.damage(ctx, target.value.id, damage);


            //- Counter & Absorb, negate signature and increment signature counter:
            const enemyIntentions = target.value.currentScript.intentions;
            let nextIntentValueChanged = false;

            for(const intention of enemyIntentions){
                switch(intention.type){
                    case EnemyIntentionType.Signature:
                        if(intention.negateDamage && intention.negateDamage > 0){
                            console.log("Signature Move was Hitted:")
                            console.log("Damage required to negate SM: " + intention.negateDamage)
                            console.log("Damage done: " + damage)
                            console.log("------------------------------------------------------")

                            if(damage >= intention.negateDamage){
                                target.value.currentScript = {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]};
                                await this.enemyService.setCurrentScript(ctx, target.value.id, target.value.currentScript);
                                console.log("SignatureMove skipped.")
                            }else{
                                intention.negateDamage -= damage;
                                nextIntentValueChanged = true;
                                console.log("SignatureMove reduced.")
                            }
                        }

                        //- Signature moves could have more than 1 effect:
                        for(const effect of intention.effects){
                            switch(effect.effect){
                                case absorbEffect.name:
                                    if(damage > oldDefense){
                                        effect.args.value += (damage - oldDefense);
                                        nextIntentValueChanged = true;
                                    }
                                case counterEffect.name:
                                    if(damage > oldDefense){
                                        effect.args.value += (damage - oldDefense);
                                        nextIntentValueChanged = true;
                                    }
                            }
                        }
                        break;
                    case EnemyIntentionType.Special:
                        //- Special moves could have more than 1 effect:
                        for(const effect of intention.effects){
                            switch(effect.effect){
                                case absorbEffect.name:
                                    if(damage > oldDefense){
                                        effect.args.value += (damage - oldDefense);
                                        nextIntentValueChanged = true;
                                    }
                                case counterEffect.name:
                                    if(damage > oldDefense){
                                        effect.args.value += (damage - oldDefense);
                                        nextIntentValueChanged = true;
                                    }
                            }
                        }
                        break;
                    case EnemyIntentionType.Absorb:
                        if(damage > oldDefense){
                            intention.effects[0].args.value += (damage - oldDefense);
                            nextIntentValueChanged = true;
                        }
                        break;

                }

                if(nextIntentValueChanged){
                    target.value.currentScript.intentions = enemyIntentions;
                    await this.enemyService.setCurrentScript(ctx, target.value.id, target.value.currentScript);
                }
            }

            newHp = target.value.hpCurrent;
            newDefense = target.value.defense;

            //- The enemy was defeated:
            if (newHp === 0) {
                let aliveEnemies = enemies.filter(enemy => enemy.hpCurrent > 0)
                
                //- Enemies with transformation after death:
                if(target.value.enemyId === deepDwellerLureData.enemyId){
                    aliveEnemies = await this.transformEnemies(ctx, aliveEnemies, target.value, deepDwellerMonsterData.enemyId);
                }
                if(target.value.enemyId === mossySkeletonData.enemyId || target.value.enemyId === mossyArcherData.enemyId){
                    aliveEnemies = await this.transformEnemies(ctx, aliveEnemies, target.value, mossyBonesData.enemyId);
                }
                if(target.value.enemyId === swarmMasterData.enemyId){
                    //- should be just for testing:
                    aliveEnemies.unshift(...[target.value]);
                }
                if(target.value.enemyId === trollData.enemyId){
                    if(target.value.backTolifeTimes == undefined){
                        target.value.hpCurrent = 1;
                        target.value.backTolifeTimes = 0;
                        
                        //Add 5 resolve
                        const status = target.value.statuses.buff.filter(s => s.name === resolveStatus.name)[0];
                        const debuff = target.value.statuses.debuff;
                        let buff = target.value.statuses.buff;

                        if(status){
                            buff = target.value.statuses.buff.map(buff => {
                                if(buff.name === resolveStatus.name){
                                    const modifyStatus = {...buff};
                                    modifyStatus.args.counter+=5
                                    return modifyStatus;
                                }
                                return buff;
                            })
                        }else{

                            const status: AttachedStatus = {
                                name: resolveStatus.name,
                                args: {counter: 5},
                                sourceReference: {
                                    type: source.type,
                                    id: source.value['id'],
                                },
                                addedInRound: ctx.expedition.currentNode.data.round,
                            };

                            buff.push(status);
                        }

                        await this.statusService.updateEnemyStatuses(ctx.expedition, target, {buff, debuff});

                        target.value.statuses = {buff, debuff};
                        aliveEnemies.unshift(...[target.value]);
                    }
                }

                // If we have on a roll effect, we return energy when the
                // enemy es defeated
                if (onARoll && onARoll.energyToRestore) {
                    await this.applyOnRoll(ctx, source, onARoll);
                }
                
                ctx.expedition.currentNode.data.enemies = aliveEnemies;
                ctx.expedition.markModified('currentNode.data.enemies');
                await ctx.expedition.save();
            }
        }
        
        if (PlayerService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0

            const damage = isNotUndefined(useEnergyAsValue)
            ? energy
            : currentValue;
            console.log(damage);

            oldHp = target.value.combatState.hpCurrent;
            oldDefense = target.value.combatState.defense;

            //aca va el if de preguntar si el enemigo tiene el estado elemental
            //target.value.combatState.statuses

            await this.playerService.damage(ctx, damage);

            newHp = target.value.combatState.hpCurrent;
            newDefense = target.value.combatState.defense;
        }

        // Add the damage to the combat queue
        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Damage,
                healthDelta: newHp - oldHp,
                defenseDelta: newDefense - oldDefense,
                finalHealth: newHp,
                finalDefense: newDefense,
                statuses: [],
            },
            action: action,
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
            ctx,
            damageDealt: currentValue,
        });
    }

    private async applyOnRoll(ctx:GameContext, source:ExpeditionEntity, onARoll:{energyToRestore:number}){
        await this.effectService.apply({
            ctx,
            source: source,
            target: source,
            effect: {
                effect: energyEffect.name,
                target: source.type,
                args: {
                    value: onARoll.energyToRestore,
                },
            },
        });

        await this.getEnergyAction.handle(ctx.client.id);
    }

    private async transformEnemies(ctx:GameContext, aliveEnemies:IExpeditionCurrentNodeDataEnemy[], originalEnemy:IExpeditionCurrentNodeDataEnemy, targetEnemyId: number): Promise<IExpeditionCurrentNodeDataEnemy[]> {

        const enemyFromDB = await this.enemyService.findById(targetEnemyId);
        
        if(enemyFromDB){
            let newEnemy = await this.enemyService.createNewStage2Enemy(enemyFromDB);

            //- Mossy enemies need to keep track of the original enemy:
            if(targetEnemyId === mossyBonesData.enemyId){
                newEnemy.mossyOriginalShape = originalEnemy.enemyId;
            }

            aliveEnemies.unshift(...[newEnemy]);

            ctx.expedition.currentNode.data.enemies = aliveEnemies;
            ctx.expedition.markModified('currentNode.data.enemies');
            await ctx.expedition.save();

            await this.enemyService.setCurrentScript(
                ctx,
                newEnemy.id,
                {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
            );

            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.TransformEnemy,
                    data: [originalEnemy, newEnemy],
                }),
            );

            return aliveEnemies;
        }
    }
}
