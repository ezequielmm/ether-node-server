import { Injectable } from "@nestjs/common";
import { EffectDTO } from "src/game/effects/effects.interface";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { revealStatus } from "./constants";

@StatusDecorator({
    status: revealStatus,
})
@Injectable()
export class RevealStatus implements StatusEffectHandler {
    
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        console.log("-----------------------------------------------------------------------------------")
        console.log("Reveal value:")
        console.log(dto.effectDTO.args.currentValue)
        console.log("-----------------------------------------------------------------------------------")
        return dto.effectDTO;
    }
}