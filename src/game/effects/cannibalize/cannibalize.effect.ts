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
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { CombatService } from "src/game/combat/combat.service";


@EffectDecorator({
    effect: cannibalizeEffect,
})
@Injectable()
export class CannibalizeEffect implements EffectHandler {

    constructor(private readonly enemyService:EnemyService,
                private readonly statusService:StatusService,
                private readonly playerService:PlayerService,
                private readonly combatService:CombatService){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        const { source, target, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){
            const hpToHeal = enemies.filter(enemy => enemy.enemyId === caveGoblinData.enemyId)
                                    .reduce((sum, enemy) => { return sum + enemy.hpCurrent}, 0);

            const newHp = source.value.hpCurrent + hpToHeal;

            const newEnemies = enemies.filter(enemy => {
                if(enemy.enemyId === caveGoblinData.enemyId){
                    this.enemyService.setHp(ctx, enemy.id, 0);
                    return false; //- Remove all the cave goblins
                }else if(enemy.enemyId === deepGoblinData.enemyId){
                    this.enemyService.setHp(ctx, source.value.id, newHp);
                    const deepHP = Math.min(newHp, enemy.hpMax);
                    enemy.hpCurrent = deepHP;
                }
                return true;
            });

            const caveGoblins = enemies.filter(enemy => enemy.enemyId === caveGoblinData.enemyId);
            const deepGoblin  = enemies.filter(enemy => enemy.enemyId === deepGoblin.enemyId);

            const sortedByLineEnemies = this.combatService.sortEnemiesByLine(newEnemies);
            ctx.expedition.currentNode.data.enemies = sortedByLineEnemies;
            ctx.expedition.markModified('currentNode.data.enemies');
            await ctx.expedition.save();

            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.Cannibalize,
                    data: [deepGoblin, caveGoblins],
                }),
            );

            const resolveToAttach: AttachDTO = {
                    ctx: dto.ctx,
                    source,
                    target,
                    statusName: resolveStatus.name,
                    statusArgs: {counter: (2 * caveGoblins.length)},
            }
                
            await this.statusService.attach(resolveToAttach)

            const feebleToAttach: AttachDTO = {
                ctx: dto.ctx,
                source,
                target: this.playerService.get(ctx),
                statusName: feebleStatus.name,
                statusArgs: {counter: (3 * caveGoblins.length)},
            }
            
            await this.statusService.attach(feebleToAttach)

            const fatigueToAttach: AttachDTO = {
                ctx: dto.ctx,
                source,
                target: this.playerService.get(ctx),
                statusName: fatigue.name,
                statusArgs: {counter: (3 * caveGoblins.length)},
            }
        
            await this.statusService.attach(fatigueToAttach)
        }
    }

}