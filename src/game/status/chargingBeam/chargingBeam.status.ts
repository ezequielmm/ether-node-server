import { Injectable } from "@nestjs/common";
import { StatusEffectDTO, StatusEffectHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { chargingBeam } from "./constants";
import { EffectDTO } from "src/game/effects/effects.interface";
import { StatusService } from "../status.service";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { deepDwellerData } from "src/game/components/enemy/data/deepDweller.enemy";

@StatusDecorator({
    status: chargingBeam,
})
@Injectable()
export class ChargingBeamStatus implements StatusEffectHandler {

    constructor(private readonly statusService:StatusService,
                private readonly enemyService:EnemyService){}
    
    preview(args: StatusEffectDTO<Record<string, any>>): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO<Record<string, any>>> {
        // args.currentValue (capaz que hay que multiplicarlo ver en damage) si es mayor a lo que tenga el enemigo como negacion
        // va a haber que persistir el status modificado.
        console.log("*******************************************Charging Beam status")
        console.log(dto.effectDTO.args)
        
        console.log("---------")
        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        console.log("onEnemiesTurnStart from chargingBeam")
        console.log(args)
        console.log("onEnemiesTurnStart from chargingBeam")

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                chargingBeam,
            );
        }
    }
}