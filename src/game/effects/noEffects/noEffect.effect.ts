import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectDTO, EffectHandler } from "../effects.interface";
import { noEffect } from "./constants";

@EffectDecorator({
    effect: noEffect,
})
@Injectable()
export class NoEffectEffect implements EffectHandler {
    
    handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        return;
    }
    
}