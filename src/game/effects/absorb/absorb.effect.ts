import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { absorbEffect } from "./constants";

@EffectDecorator({
    effect: absorbEffect,
})
@Injectable()
export class AbsorbEffect implements EffectHandler {

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        // todo:
    }
}