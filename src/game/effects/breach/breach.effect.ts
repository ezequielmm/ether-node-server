import { Injectable } from "@nestjs/common";
import { EffectDecorator } from "../effects.decorator";
import { EffectHandler, EffectDTO } from "../effects.interface";
import { breachEffect } from "./constants";
import { PlayerService } from "src/game/components/player/player.service";
import { CombatQueueService } from "src/game/components/combatQueue/combatQueue.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CombatQueueTargetEffectTypeEnum } from "src/game/components/combatQueue/combatQueue.enum";
import { EVENT_AFTER_DAMAGE_EFFECT } from "src/game/constants";

@EffectDecorator({
    effect: breachEffect,
})
@Injectable()
export class BreachEffect implements EffectHandler {
    
    constructor(private readonly playerService:PlayerService,
                private readonly combatQueueService:CombatQueueService,
                private readonly eventEmitter: EventEmitter2){}

    async handle(dto: EffectDTO<Record<string, any>>): Promise<void> {
        
        const target = dto.target;
        const ctx    = dto.ctx;
        const damage = dto.args.currentValue;

        if (PlayerService.isPlayer(target)) {

            const oldHp = target.value.combatState.hpCurrent;
            await this.playerService.breach(ctx, damage);

            const newHp = target.value.combatState.hpCurrent;
            const newDefense = target.value.combatState.defense;
            
            // Add the damage to the combat queue
            await this.combatQueueService.push({
                ctx,
                source: dto.source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Damage,
                    healthDelta: newHp - oldHp,
                    defenseDelta: 0,
                    finalHealth: newHp,
                    finalDefense: newDefense,
                    statuses: [],
                },
                action: dto.action,
            });
            
            await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
                ctx,
                damageDealt: damage,
            });
        }
    
    }
}