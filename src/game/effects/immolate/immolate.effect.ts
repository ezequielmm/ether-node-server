import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { immolateEffect } from "./constants";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT_AFTER_DAMAGE_EFFECT } from "src/game/constants";

@EffectDecorator({
    effect: immolateEffect,
})
@Injectable()
export class ImmolateEffect implements EffectHandler {
    
    constructor(private readonly eventEmitter: EventEmitter2) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, ctx } = dto;
        const enemies = dto.ctx.expedition.currentNode.data.enemies;

        if(EnemyService.isEnemy(source)){
            const updatedEnemies = enemies.filter(enemy => enemy.id !== source.value.id);

            console.log("Immolate Efefct --------------- ----------------------------------------------")
            console.log(updatedEnemies)
            console.log("------------------------------- ----------------------------------------------")

            ctx.expedition.currentNode.data.enemies = updatedEnemies;
            ctx.expedition.markModified('currentNode.data.enemies');
            await ctx.expedition.save();

            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.Immolate,
                    data: source.value,
                }),
            );

            await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
                ctx,
                damageDealt: source.value.hpCurrent,
            });
        }
    }

}