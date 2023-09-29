import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { transformEffect } from "./constants";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { IExpeditionCurrentNodeDataEnemy } from "src/game/components/expedition/expedition.interface";

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
            const enemyToTransformId = source.value.mossyOriginalShape;
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
            updatedEnemies.push(newEnemy);

            ctx.expedition.currentNode.data.enemies = updatedEnemies;
            ctx.expedition.markModified('currentNode.data.enemies');
            await ctx.expedition.save();

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