import { Injectable } from "@nestjs/common";
import { EffectDTO } from "src/game/effects/effects.interface";
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { hiddenStatus } from "./constants";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { StatusService } from "../status.service";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";

@StatusDecorator({
    status: hiddenStatus,
})
@Injectable()
export class HiddenStatus implements StatusEffectHandler {

    constructor(private readonly statusService:StatusService,
                private readonly enemyService:EnemyService,
                private readonly playerService:PlayerService){}
    
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        
        const { effectDTO } = dto;

        console.log("-----------------------------------------------------------------------------")
        console.log("-----------------------------------------------------------------------------")
        console.log("Checking Hidden Status");
        console.log("effectDTO.args.currentValue:")
        console.log(effectDTO.args.currentValue)

        console.log("effectDTO.args:");
        console.log(effectDTO.args)

        console.log("dto.status");
        console.log(dto.status)

        // effectDTO.args.currentValue = Math.max(
        //     effectDTO.args.currentValue + dto.status.args.counter,
        //     0,
        // );

        return effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        console.log("------------------- BEFORE ENEMY TURN START");
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);


        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                hiddenStatus,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart(args: { ctx: GameContext }): Promise<void> {
        console.log("------------------- BEFORE PLAYER TURN START");
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            hiddenStatus,
        );
    }
}