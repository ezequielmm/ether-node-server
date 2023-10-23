import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";
import { DamageArgs } from "src/game/effects/damage/damage.effect";
import { ApplyDTO, EffectDTO } from "src/game/effects/effects.interface";
import { EffectService } from "src/game/effects/effects.service";
import { StatusEffectHandler, StatusEffectDTO } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { StatusService } from "../status.service";
import { absorbingStatus } from "./constants";
import { OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";
import { counterStatus } from "../counter/constants";
import { healEffect } from "src/game/effects/heal/constants";

@StatusDecorator({
    status: absorbingStatus,
})
@Injectable()
export class AbsorbingStatus implements StatusEffectHandler {

    constructor(private readonly effectService: EffectService,
                private readonly enemyService:EnemyService,
                private readonly statusService:StatusService,
                private readonly playerService:PlayerService) {}

    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        
        const { ctx, effectDTO } = dto;

        if (typeof effectDTO.args.type === 'undefined' || effectDTO.args.type.length == 0) {
            const {
                args: {
                    currentValue,
                    useDefense,
                    multiplier,
                    useEnergyAsMultiplier
                },
            } = effectDTO;

            const {
                value: {
                    combatState: { energy, defense },
                },
            } = this.playerService.get(ctx);

            //- Get the final attack
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

                if(EnemyService.isEnemy(effectDTO.target)){
                    const applyDTO: ApplyDTO = {
                        ctx: ctx,
                        source: effectDTO.source,
                        target: effectDTO.target,
                        effect: {
                            effect: healEffect.name,
                            args: {
                                value: damage, 
                            },
                        },
                    };
        
                    await this.effectService.apply(applyDTO);
                }  
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
                absorbingStatus,
            );
        }
    }

}