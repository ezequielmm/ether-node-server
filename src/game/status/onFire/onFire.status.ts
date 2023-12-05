import { Injectable } from "@nestjs/common";
import { ApplyDTO, EffectDTO } from "src/game/effects/effects.interface";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { onFireStatus } from "./constants";
import { damageEffect } from "src/game/effects/damage/constants";
import { EffectService } from "src/game/effects/effects.service";
import { StatusService } from "../status.service";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";

@StatusDecorator({
    status: onFireStatus,
})

@Injectable()
export class OnFireStatus implements StatusEffectHandler {

    constructor(private readonly effectService:EffectService,
                private readonly statusService:StatusService,
                private readonly enemyService:EnemyService){}
    
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        
        const { ctx, effectDTO, status } = dto;

        // Apply damage to the source, if incoming damage is untyped
        if (typeof effectDTO.args.type === 'undefined' || effectDTO.args.type.length == 0) {
            let timesHitted = 1;
            if(effectDTO.args.doubleValuesWhenPlayed){
                timesHitted = effectDTO.args.initialValue;
            }

            // Return the damage to the source with the value of the status
            const applyDTO: ApplyDTO = {
                ctx: ctx,
                source: effectDTO.target,
                target: effectDTO.source,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: (2 * timesHitted), 
                        type: 'onFire',
                    },
                },
            };

            await this.effectService.apply(applyDTO);
        }

        // Don't modify the args, the target will be damaged as well.
        return effectDTO;
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
                onFireStatus,
            );
        }
    }
}

