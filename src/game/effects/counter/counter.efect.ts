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
    
    //constructor(private readonly playerService:PlayerService){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {

        console.log("Inside counter effect")

        const target = dto.target;
        const ctx    = dto.ctx;
        const damage = dto.args.currentValue;

        if (PlayerService.isPlayer(target)) {
            console.log("Inside counter effect")
            console.log("Ver si se va a usar o uso el de damage")
        }
    }
    
}