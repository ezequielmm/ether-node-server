import { Injectable } from "@nestjs/common";
import { DamageArgs } from "src/game/effects/damage/damage.effect";
import { ApplyDTO, EffectDTO } from "src/game/effects/effects.interface";
import { EffectService } from "src/game/effects/effects.service";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { counterStatus } from "./constants";
import { damageEffect } from "src/game/effects/damage/constants";
import { StatusService } from "../status.service";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";

@StatusDecorator({
    status: counterStatus,
})
@Injectable()
export class CounterStatus implements StatusEffectHandler {

    constructor(private readonly effectService: EffectService,
                private readonly enemyService:EnemyService,
                private readonly statusService:StatusService) {}

    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        // Apply damage to the source
        const { ctx, effectDTO, status } = dto;

        if (typeof effectDTO.args.type === 'undefined' || effectDTO.args.type.length == 0) {

            console.log("--------------------- Counter Status:")
            console.log("Damage amount: " + effectDTO.args.currentValue);
            
            if(EnemyService.isEnemy(effectDTO.target)){
                console.log("Enemy hp: " + effectDTO.target.value.hpCurrent);
            }

            //- Return the damage to the source with the value of the status
            const applyDTO: ApplyDTO = {
                ctx: ctx,
                source: effectDTO.target,
                target: effectDTO.source,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: effectDTO.args.currentValue, 
                        type: 'counter',
                    },
                },
            };

            await this.effectService.apply(applyDTO);
        }

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
                counterStatus,
            );
        }
    }

}