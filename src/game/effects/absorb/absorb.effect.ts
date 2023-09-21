import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { absorbEffect } from "./constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";

@EffectDecorator({
    effect: absorbEffect,
})
@Injectable()
export class AbsorbEffect implements EffectHandler {

    constructor(private readonly enemyService:EnemyService){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        
        const { ctx, source } = dto;
        console.log("----------------------------------------------------")
        console.log("Inside AbsorbEffect");
        
        if(EnemyService.isEnemy(source)){
            console.log("Source is an Enemy");
            console.log("Args:");
            console.log(dto.args)
            const healAmount = dto.args.currentValue;
            if(healAmount && healAmount > 0){
                const newHp = source.value.hpCurrent;
                this.enemyService.setHp(ctx, source.value.enemyId, newHp);
            }
        }
        console.log("----------------------------------------------------")
    }
}