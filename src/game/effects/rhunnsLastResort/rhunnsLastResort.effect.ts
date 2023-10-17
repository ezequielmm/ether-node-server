import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectDTO, EffectHandler } from "../effects.interface";
import { rhunnsLastResortEffect } from "./constants";
import { getRandomBetween } from "src/utils";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";
import { CombatQueueService } from "src/game/components/combatQueue/combatQueue.service";
import { CombatQueueTargetEffectTypeEnum } from "src/game/components/combatQueue/combatQueue.enum";
import { EVENT_AFTER_DAMAGE_EFFECT } from "src/game/constants";
import { EventEmitter2 } from "@nestjs/event-emitter";

export interface RhunnsLastResortArgs {
    minDamage: number;
    maxDamage: number;
}

@EffectDecorator({
    effect: rhunnsLastResortEffect,
})
@Injectable()
export class RhunnsLastResortEffect implements EffectHandler {
    
    constructor(private readonly enemyService:EnemyService,
                private readonly playerService:PlayerService,
                private readonly combatQueueService: CombatQueueService,
                private readonly eventEmitter:EventEmitter2){}

    async handle(dto: EffectDTO<RhunnsLastResortArgs>): Promise<void> {
        
        const {target, source, ctx, action} = dto;

        if(EnemyService.isEnemy(target)){
            const damage = getRandomBetween(dto.args.minDamage, dto.args.maxDamage);

            const player = await this.playerService.get(ctx);
            const oldHp = player.value.combatState.hpCurrent;
            const defense = player.value.combatState.defense;

            const playerNewHp = await this.playerService.breach(ctx, damage);

            // Add the damage to the combat queue
            await this.combatQueueService.push({
                ctx,
                source,
                target: source,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Damage,
                    healthDelta: playerNewHp - oldHp,
                    defenseDelta: 0,
                    finalHealth: playerNewHp,
                    finalDefense: defense,
                    statuses: [],
                },
                action: action,
            });

            await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
                ctx,
                damageDealt: damage,
            });


            //- If the player survives the effect, it will swap his life with a random enemy life:
            if(playerNewHp > 0){
                const targetHp = target.value.hpCurrent;
                const targetDefense = target.value.defense;

                //- New HP to (random) Enemy
                const enemyNewHp = await this.enemyService.setHp(ctx, target.value.id, playerNewHp);
                await this.combatQueueService.push({
                    ctx,
                    source,
                    target,
                    args: {
                        effectType: CombatQueueTargetEffectTypeEnum.Damage,
                        healthDelta: targetHp - enemyNewHp,
                        defenseDelta: 0,
                        finalHealth: enemyNewHp,
                        finalDefense: targetDefense,
                        statuses: [],
                    },
                    action: action,
                });


                //- New HP to Player:
                const playerUpdatedHp = await this.playerService.setHP({ctx, newHPCurrent: targetHp});
                await this.combatQueueService.push({
                    ctx,
                    source,
                    target: source,
                    args: {
                        effectType: CombatQueueTargetEffectTypeEnum.Damage,
                        healthDelta: playerUpdatedHp - enemyNewHp,
                        defenseDelta: 0,
                        finalHealth: playerUpdatedHp,
                        finalDefense: defense,
                        statuses: [],
                    },
                    action: action,
                });
            }
        }

    }

}