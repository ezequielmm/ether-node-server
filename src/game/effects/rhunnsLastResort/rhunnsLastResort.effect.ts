import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectDTO, EffectHandler } from "../effects.interface";
import { rhunnsLastResortEffect } from "./constants";
import { getRandomBetween } from "src/utils";
import { EnemyService } from "src/game/components/enemy/enemy.service";

export interface RhunnsLastResortArgs {
    minDamage: number;
    maxDamage: number;
}

@EffectDecorator({
    effect: rhunnsLastResortEffect,
})
@Injectable()
export class RhunnsLastResortEffect implements EffectHandler {
    
    constructor(private readonly enemyService:EnemyService){}

    async handle(dto: EffectDTO<RhunnsLastResortArgs>): Promise<void> {
        
        const target = dto.target;
        const ctx    = dto.ctx;

        console.log("RhunnsLastResort Effect-------------------------");
        console.log("RandomEnemy: ");
        if(EnemyService.isEnemy(target)){
            console.log(target.value.enemyId);
            const damage = getRandomBetween(dto.args.minDamage, dto.args.maxDamage);

            console.log("Random damage: " + damage);
            console.log("----------------------------------------")
        }

    }

}