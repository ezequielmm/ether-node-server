import { Injectable } from "@nestjs/common";
import { StatusEventDTO, StatusEventHandler } from "../interfaces";
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
export class RevealStatus implements StatusEventHandler {

    constructor(private readonly enemyService:EnemyService, private readonly statusService:StatusService){}


    async handle(dto: StatusEventDTO): Promise<void> {
        console.log("Reveal status-----------")
        const { ctx, update, remove, status, source, target } = dto;
        // Decrease counter
        status.args.counter--;

        // Remove status if counter is 0
        if (status.args.counter === 0) {
            console.log("Acá mataríamos al cofre e invocaríamos al mimic")
            remove();
        } else {
            update(status.args);
        }
    }

    // @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    // async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
    //     const { ctx } = args;
    //     const enemies = this.enemyService.getAll(ctx);

    //     for (const enemy of enemies) {
    //         await this.statusService.decreaseCounterAndRemove(
    //             ctx,
    //             enemy.value.statuses,
    //             enemy,
    //             revealStatus,
    //         );
    //     }
    // }
}