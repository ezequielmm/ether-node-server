import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { mitosisEffect } from "./constants";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";

@EffectDecorator({
    effect: mitosisEffect,
})
@Injectable()
export class MitosisEffect implements EffectHandler {
    
    constructor(private readonly enemyService: EnemyService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){
            
            const originalMold = source.value;
            const moldDB = await this.enemyService.findById(originalMold.enemyId);
            const newMold = await this.enemyService.createNewStage2EnemyWithStatuses(moldDB, originalMold.statuses.buff, originalMold.statuses.debuff);

            const updatedEnemies = [...enemies, newMold]

            ctx.expedition.currentNode.data.enemies = updatedEnemies;
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
        }
    }

}