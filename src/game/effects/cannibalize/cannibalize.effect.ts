import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { cannibalizeEffect } from "./constants";

@EffectDecorator({
    effect: cannibalizeEffect,
})
@Injectable()
export class CannibalizeEffect implements EffectHandler {

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        console.log("Cannibalize effect executed---------------------------------------------------")
        return;
    }

}