import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";
import { EffectDTO } from "src/game/effects/effects.interface";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { StatusService } from "../status.service";
import { hatchingStatus } from "./constants";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_END, EVENT_BEFORE_PLAYER_TURN_END } from "src/game/constants";
import { hiddenStatus } from "../hidden/constants";

@StatusDecorator({
    status: hatchingStatus,
})
@Injectable()
export class HatchingStatus implements StatusEffectHandler {

    constructor(private readonly statusService:StatusService,
                private readonly enemyService:EnemyService,
                private readonly playerService:PlayerService){}
    
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                hatchingStatus,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onPlayerTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            hatchingStatus,
        );
    }
}