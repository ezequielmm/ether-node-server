import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectDTO, EffectHandler } from "../effects.interface";
import { rhunnsLastResortEffect } from "./constants";
import { getRandomBetween } from "src/utils";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";

export interface RhunnsLastResortArgs {
    minDamage: number;
    maxDamage: number;
}

@EffectDecorator({
    effect: rhunnsLastResortEffect,
})
@Injectable()
export class RhunnsLastResortEffect implements EffectHandler {
    
    constructor(private readonly enemyService:EnemyService,
                private readonly playerService:PlayerService){}

    async handle(dto: EffectDTO<RhunnsLastResortArgs>): Promise<void> {
        
        const target = dto.target;
        const ctx    = dto.ctx;

        if(EnemyService.isEnemy(target)){
            const damage = getRandomBetween(dto.args.minDamage, dto.args.maxDamage);

            const playerNewHp = await this.playerService.breach(ctx, damage);

            if(playerNewHp > 0){
                console.log("Intercambiar vida con el enemy")
            }
        }

    }

}