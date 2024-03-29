import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { transformEffect } from "./constants";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { IExpeditionCurrentNodeDataEnemy } from "src/game/components/expedition/expedition.interface";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";
import { mossyArcherData } from "src/game/components/enemy/data/mossyArcher.enemy";
import { mossySkeletonData } from "src/game/components/enemy/data/mossySkeleton.enemy";
import { getRandomItemByWeight } from "src/utils";

@EffectDecorator({
    effect: transformEffect,
})
@Injectable()
export class TransformEffect implements EffectHandler {
    
    constructor(private readonly enemyService: EnemyService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){
            let enemyToTransformId = source.value.mossyOriginalShape;

            if(!enemyToTransformId){
                enemyToTransformId = getRandomItemByWeight([mossyArcherData.enemyId, mossySkeletonData.enemyId], [50, 50]);
            }

            const enemy = await this.enemyService.findById(enemyToTransformId);

            if(!enemy){
                console.log("transform.effect#handle: Enemy not found in DB.")
                return;
            }

            const newEnemy = await this.enemyService.createNewStage2Enemy(enemy);
            if(!newEnemy){
                console.log("transform.effect#handle: newEnemy not created.")
                return;
            }
            
            let updatedEnemies:IExpeditionCurrentNodeDataEnemy[] = enemies.filter(enemy => enemy.id !== source.value.id);
            //- Set de same line as the original enemy:
            newEnemy.line = source.value.line;
            updatedEnemies.push(newEnemy);

            ctx.expedition.currentNode.data.enemies = updatedEnemies;
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
                    data: [source.value, newEnemy],
                }),
            );

        }
    }

}