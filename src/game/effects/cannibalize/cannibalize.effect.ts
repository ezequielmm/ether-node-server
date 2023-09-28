import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { cannibalizeEffect } from "./constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { caveGoblinData } from "src/game/components/enemy/data/caveGoblin.enemy";
import { deepGoblinData } from "src/game/components/enemy/data/deepGoblin.enemy";
import { StatusService } from "src/game/status/status.service";
import { AttachDTO } from "src/game/status/interfaces";
import { resolveStatus } from "src/game/status/resolve/constants";
import { feebleStatus } from "src/game/status/feeble/constants";
import { fatigue } from "src/game/status/fatigue/constants";
import { PlayerService } from "src/game/components/player/player.service";


@EffectDecorator({
    effect: cannibalizeEffect,
})
@Injectable()
export class CannibalizeEffect implements EffectHandler {

    constructor(private readonly enemyService:EnemyService,
                private readonly statusService:StatusService,
                private readonly playerService:PlayerService){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        const { source, target, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){
            console.log("Inside cannibalize effect------------------------")
            const hpToHeal = enemies.filter(enemy => enemy.enemyId === caveGoblinData.enemyId)
                                    .reduce((sum, enemy) => { return sum + enemy.hpCurrent}, 0);

            console.log("Max HP to heal: " + hpToHeal)
            const newHp = source.value.hpCurrent + hpToHeal;
            console.log("Hp healed: " + newHp)

            enemies.forEach(async enemy => {
                if(enemy.enemyId === caveGoblinData.enemyId){
                    await this.enemyService.setHp(ctx, enemy.id, 0);
                    return {...enemy, hpCurrent: 0}
                }else if(enemy.enemyId === deepGoblinData.enemyId){
                    const deepHP = await this.enemyService.setHp(ctx, source.value.id, newHp);
                    return {...enemy, hpCurrent: deepHP}
                }
            });

            const amountCaveGoblins = enemies.filter(enemy => enemy.enemyId === caveGoblinData.enemyId).length;
            const updatedEnemies = enemies.filter(enemy => enemy.hpCurrent > 0);

            console.log("Updated Enemies amount: " + updatedEnemies.length)

            ctx.expedition.currentNode.data.enemies = updatedEnemies;
            ctx.expedition.markModified('currentNode.data.enemies');
            await ctx.expedition.save();


            console.log("After enmies updated.")
            
            //- TODO:
            //- todo: Ver como se le comunica a Unity.

            const resolveToAttach: AttachDTO = {
                    ctx: dto.ctx,
                    source,
                    target,
                    statusName: resolveStatus.name,
                    statusArgs: {counter: (2 * amountCaveGoblins)},
            }
                
            await this.statusService.attach(resolveToAttach)

            const feebleToAttach: AttachDTO = {
                ctx: dto.ctx,
                source,
                target: this.playerService.get(ctx),
                statusName: feebleStatus.name,
                statusArgs: {counter: (3 * amountCaveGoblins)},
            }
            
            await this.statusService.attach(feebleToAttach)

            const fatigueToAttach: AttachDTO = {
                ctx: dto.ctx,
                source,
                target: this.playerService.get(ctx),
                statusName: fatigue.name,
                statusArgs: {counter: (3 * amountCaveGoblins)},
            }
        
            await this.statusService.attach(fatigueToAttach)

            console.log("Cannibalize finish-------------------------------------------------------------------------------------")
        }
    }

}