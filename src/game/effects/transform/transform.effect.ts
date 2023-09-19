import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { transformEffect } from "./constants";

@EffectDecorator({
    effect: transformEffect,
})
@Injectable()
export class TransformEffect implements EffectHandler {
    
    handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        console.log("Inside transform effect------------")
        return;
    }
    
}