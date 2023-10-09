import { Injectable } from "@nestjs/common";
import { DamageArgs } from "src/game/effects/damage/damage.effect";
import { EffectDTO } from "src/game/effects/effects.interface";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { growedStatus } from "./constants";

@StatusDecorator({
    status: growedStatus,
})
@Injectable()
export class GrowedStatus implements StatusEffectHandler {
    
    async preview(args: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        
        const effectDTO = dto.effectDTO;

        effectDTO.args.currentValue = Math.max(
            effectDTO.args.currentValue + dto.status.args.counter,
            0,
        );

        return effectDTO;
    }
}