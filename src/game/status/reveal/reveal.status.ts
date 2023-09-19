import { Injectable } from "@nestjs/common";
import { EffectDTO } from "src/game/effects/effects.interface";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { revealStatus } from "./constants";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";
import { StatusService } from "../status.service";
import { EnemyService } from "src/game/components/enemy/enemy.service";

@StatusDecorator({
    status: revealStatus,
})
@Injectable()
export class RevealStatus implements StatusEffectHandler {

    constructor(private readonly enemyService:EnemyService, private readonly statusService:StatusService){}
    
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                revealStatus,
            );
        }
    }
}