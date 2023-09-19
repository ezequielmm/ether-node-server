import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectDTO, EffectHandler } from "../effects.interface";
import { counterEffect } from "./constants";
import { PlayerService } from "src/game/components/player/player.service";

@EffectDecorator({
    effect: counterEffect,
})
@Injectable()
export class CounterEffect implements EffectHandler {
    
    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {

        const target = dto.target;
        const ctx    = dto.ctx;
        const damage = dto.args.currentValue;

        if (PlayerService.isPlayer(target)) {
            
        }
    }
    
}