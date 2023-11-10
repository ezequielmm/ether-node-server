import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { sporeDanceEffect } from "./constants";
import { moldPolypData } from "src/game/components/enemy/data/moldPolyp.enemy";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";
import { moldPolypMinionData } from "src/game/components/enemy/data/moldPolyp-minion.enemy";
import { caveHomunculiMinionData } from "src/game/components/enemy/data/caveHomunculi-minion.enemy";

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
            const moldPolypsOriginalAndMinions = enemies.filter(enemy => enemy.enemyId === moldPolypData.enemyId || enemy.enemyId === moldPolypMinionData.enemyId);
            if(moldPolypsOriginalAndMinions.length > 0){
                let listHomunculisMinion = [];
                const caveHomunculiMinionDB = await this.enemyService.findById(caveHomunculiMinionData.enemyId);
                for(const polyp of moldPolypsOriginalAndMinions){
                    const newHomunculiMinion = await this.enemyService.createNewStage2Enemy(caveHomunculiMinionDB);
                    const polypIndex = enemies.findIndex(enemy => enemy.id === polyp.id);
                    
                    if (polypIndex !== -1) {
                        enemies[polypIndex] = newHomunculiMinion;
                    }

                    listHomunculisMinion.push(newHomunculiMinion);
                }
                ctx.expedition.currentNode.data.enemies = enemies;
                ctx.expedition.markModified('currentNode.data.enemies');
                await ctx.expedition.save();

                for(const homunculi of listHomunculisMinion){
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
                        data: [moldPolypsOriginalAndMinions, listHomunculisMinion],
                    }),
                );
            }

        }
    }

}