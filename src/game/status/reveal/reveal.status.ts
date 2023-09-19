import { Injectable } from "@nestjs/common";
import { StatusEventDTO, StatusEventHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { revealStatus } from "./constants";
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
            console.log("Source")
            console.log(source)
            console.log("-----------------------------------------------")
            console.log("target:")
            console.log(target)
            remove();
            this.enemyService.setHp(ctx, source.value.id, 0);

        } else {
            update(status.args);
        }
    }
}