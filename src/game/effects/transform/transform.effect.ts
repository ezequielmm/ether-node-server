import { Injectable } from "@nestjs/common";
import { transform } from "lodash";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";

@EffectDecorator({
    effect: transform,
})
@Injectable()
export class TransformEffect implements EffectHandler {
    
    handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        console.log("Inside transform effect-------")
        return;
    }
    
}