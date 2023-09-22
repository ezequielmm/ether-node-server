import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { absorbEffect } from "./constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { CombatQueueTargetEffectTypeEnum } from "src/game/components/combatQueue/combatQueue.enum";
import { GameContext, ExpeditionEntity } from "src/game/components/interfaces";
import { CombatQueueService } from "src/game/components/combatQueue/combatQueue.service";

@EffectDecorator({
    effect: absorbEffect,
})
@Injectable()
export class AbsorbEffect implements EffectHandler {

    constructor(private readonly enemyService:EnemyService, private readonly combatQueueService:CombatQueueService){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        
        const { ctx, source, target } = dto;
        console.log("----------------------------------------------------")
        console.log("Inside AbsorbEffect");
        
        if(EnemyService.isEnemy(source)){
            console.log("Source is an Enemy");
            console.log("Args:");
            console.log(dto.args)
            const healAmount = dto.args.currentValue;
            if(healAmount && healAmount > 0){
                const hpCurrent = source.value.hpCurrent;
                let newHp = hpCurrent + healAmount;
                newHp = await this.enemyService.setHp(ctx, source.value.enemyId, newHp);

                await this.sendToCombatQueue(
                    ctx,
                    source,
                    target,
                    newHp - hpCurrent,
                    newHp,
                );
            }
        }
        console.log("----------------------------------------------------")
    }

    private async sendToCombatQueue(
        ctx: GameContext,
        source: ExpeditionEntity,
        target: ExpeditionEntity,
        healthDelta: number,
        finalHealth: number,
    ): Promise<void> {
        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Heal,
                defenseDelta: 0,
                finalDefense: 0,
                healthDelta,
                finalHealth,
                statuses: [],
            },
        });
    }
}