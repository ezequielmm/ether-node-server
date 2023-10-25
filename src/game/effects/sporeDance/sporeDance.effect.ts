import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { sporeDanceEffect } from "./constants";
import { moldPolypData } from "src/game/components/enemy/data/moldPolyp.enemy";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { caveHomunculiData } from "src/game/components/enemy/data/caveHomunculi.enemy";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";

@EffectDecorator({
    effect: sporeDanceEffect,
})
@Injectable()
export class SporeDanceEffect implements EffectHandler {
    
    constructor(private readonly enemyService: EnemyService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, ctx } = dto;
        let enemies = [...dto.ctx.expedition.currentNode.data.enemies];

        if(EnemyService.isEnemy(source)){
            const moldPolyps = enemies.filter(enemy => enemy.enemyId === moldPolypData.enemyId);
            if(moldPolyps.length > 0){
                let listHomunculis = [];
                const caveHomunculiDB = await this.enemyService.findById(caveHomunculiData.enemyId);
                for(const polyp of moldPolyps){
                    const newHomunculi = await this.enemyService.createNewStage2Enemy(caveHomunculiDB);
                    const polypIndex = enemies.findIndex(enemy => enemy.id === polyp.id);
                    
                    if (polypIndex !== -1) {
                        enemies[polypIndex] = newHomunculi;
                    }

                    listHomunculis.push(newHomunculi);
                }
                ctx.expedition.currentNode.data.enemies = enemies;
                ctx.expedition.markModified('currentNode.data.enemies');
                await ctx.expedition.save();

                for(const homunculi of listHomunculis){
                    await this.enemyService.setCurrentScript(
                        ctx,
                        homunculi.id,
                        {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
                    );
                }

                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.CombatUpdate,
                        action: SWARAction.SporeDance,
                        data: [moldPolyps, listHomunculis],
                    }),
                );
            }

        }
    }

}