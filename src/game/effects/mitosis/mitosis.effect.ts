import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { mitosisEffect } from "./constants";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { moldPolypMinionData } from "src/game/components/enemy/data/moldPolyp-minion.enemy";
import { CombatService } from "src/game/combat/combat.service";

@EffectDecorator({
    effect: mitosisEffect,
})
@Injectable()
export class MitosisEffect implements EffectHandler {
    
    constructor(private readonly enemyService: EnemyService,
        private readonly combatService:CombatService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){     
            
            const originalMold = source.value;
            const moldMinionDB = await this.enemyService.findById(moldPolypMinionData.enemyId);
            const enemiesAlive = this.enemyService.getLiving(ctx);
            const currentNodeEnemies = enemiesAlive.map(enemy => enemy.value);

            const newMold = await this.enemyService.createNewStage2EnemyWithStatuses(moldMinionDB, originalMold.statuses.buff, originalMold.statuses.debuff);
            const canSpawnEnemy = this.combatService.hasSpaceToSpawnEnemy(currentNodeEnemies, [newMold]);

            if(canSpawnEnemy){
                const updatedEnemies = [...enemies, newMold]
                const sortedByLineEnemies = this.combatService.sortEnemiesByLine(updatedEnemies)

                ctx.expedition.currentNode.data.enemies = sortedByLineEnemies;
                ctx.expedition.markModified('currentNode.data.enemies');
                await ctx.expedition.save();
    
                await this.enemyService.setCurrentScript(
                    ctx,
                    newMold.id,
                    {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
                );
    
                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.CombatUpdate,
                        action: SWARAction.Mitosis,
                        data: [originalMold, newMold],
                    }),
                );
            }else{
                console.log("not enough space to spawn the enemy")
            }
        }
    }

}