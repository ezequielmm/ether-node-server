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
import { ENEMY_DEEP_DWELLER_LURE_ID, ENEMY_DEEP_DWELLER_MONSTER_ID } from 'src/game/components/enemy/constants';
import { StandardResponse, SWARMessageType, SWARAction } from 'src/game/standardResponse/standardResponse';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { absorbEffect } from '../absorb/constants';
import { counterEffect } from '../counter/constants';

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
        private readonly expeditionService:ExpeditionService
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
            console.log("6) Back in damage.effect")




            //- Counter & Absorb, negate signature and increment signature counter:
            const enemyIntentions = target.value.currentScript.intentions;
            let nextIntentValueChanged = false;

            for(const intention of enemyIntentions){
                switch(intention.type){
                    case EnemyIntentionType.Signature:
                        if(intention.negateDamage && intention.negateDamage > 0){
                            if(damage >= intention.negateDamage){
                                target.value.currentScript = {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]};
                                await this.enemyService.setCurrentScript(ctx, target.value.id, target.value.currentScript);
                            }else{
                                intention.negateDamage -= damage;
                                nextIntentValueChanged = true;
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
                    case EnemyIntentionType.Counter:
                        if(damage > oldDefense){
                            intention.effects[0].args.value += (damage - oldDefense);
                            nextIntentValueChanged = true;
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


            console.log("7) currentHP from target: " + newHp)

            // Here we check if the enemy was defeated to run the on a roll
            // or executioner's blow
            // effect only if the enemy's health is 0
            if (newHp === 0) {
                if(target.value.enemyId === ENEMY_DEEP_DWELLER_LURE_ID){
                    const enemyFromDB = await this.enemyService.findById(ENEMY_DEEP_DWELLER_MONSTER_ID);

                    if(enemyFromDB){
                        const newEnemy = await this.enemyService.createNewStage2Enemy(enemyFromDB);
                        
                        const aliveEnemies = enemies.filter(enemy => enemy.hpCurrent > 0)
                        aliveEnemies.unshift(...[newEnemy]);
                        
                        console.log("8) Alive enemies: ")
                        console.log(aliveEnemies)

                        //- todo: Este mensaje puede cambiar para que se ejecute otra animacion en unity
                        ctx.client.emit(
                            'PutData',
                            StandardResponse.respond({
                                message_type: SWARMessageType.CombatUpdate,
                                action: SWARAction.SpawnEnemies,
                                data: newEnemy,
                            }),
                        );

                        await this.expeditionService.updateByFilter(
                            {
                                _id: ctx.expedition._id,
                                status: ExpeditionStatusEnum.InProgress,
                            },
                            { $set: { 'currentNode.data.enemies': aliveEnemies } },
                        );

                        // Now we generate a new ctx to generate the new enemy intentions
                        ctx = await this.expeditionService.getGameContext(ctx.client);

                        console.log("10) New COntext Enemies from final context:")
                        console.log(ctx.expedition.currentNode.data.enemies)

                        await this.enemyService.setCurrentScript(
                            ctx,
                            enemyFromDB.enemyId,
                            {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
                        );
                        
                    }
                }

                // If we have on a roll effect, we return energy when the
                // enemy es defeated
                if (onARoll && onARoll.energyToRestore) {
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
            }
        }

        if (PlayerService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const damage = isNotUndefined(useEnergyAsValue)
                ? energy
                : currentValue;

            oldHp = target.value.combatState.hpCurrent;
            oldDefense = target.value.combatState.defense;

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

        console.log("11) In old context Enemies from final context:")
        console.log(ctx.expedition.currentNode.data.enemies)
        await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
            ctx,
            damageDealt: currentValue,
        });
    }
}
