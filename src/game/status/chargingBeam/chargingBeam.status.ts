import { Injectable } from "@nestjs/common";
import { AttachDTO, StatusEffectDTO, StatusEffectHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { chargingBeam } from "./constants";
import { EffectDTO } from "src/game/effects/effects.interface";
import { AfterStatusesUpdateEvent, StatusService } from "../status.service";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { GameContext } from "src/game/components/interfaces";
import { EVENT_AFTER_STATUSES_UPDATE, EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { PlayerService } from "src/game/components/player/player.service";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";

@StatusDecorator({
    status: chargingBeam,
})
@Injectable()
export class ChargingBeamStatus implements StatusEffectHandler {

    constructor(private readonly statusService:StatusService,
                private readonly enemyService:EnemyService,
                private readonly eventEmitter: EventEmitter2,
                private readonly playerService:PlayerService){}
    
    preview(args: StatusEffectDTO<Record<string, any>>): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO<Record<string, any>>> {
        if(EnemyService.isEnemy(dto.effectDTO.target)){
            const { target } = dto.effectDTO;
            const status = target.value.statuses.buff.filter(s => s.name === chargingBeam.name)[0];

            const {
                args: {
                    currentValue,
                    useDefense,
                    multiplier,
                    useEnergyAsMultiplier
                },
            } = dto.effectDTO;

            const {
                value: {
                    combatState: { energy, defense },
                },
            } = this.playerService.get(dto.ctx);

            //- Get the final attack
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

            if(status.args.counter < 2 && damage >= 20){
                const debuff = target.value.statuses.debuff;
                const buff = target.value.statuses.buff.map(buff => {
                    if(buff.name === chargingBeam.name){
                        //- Change next intent (cancel attack until next turn)
                        target.value.currentScript = {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]};
                        this.enemyService.setCurrentScript(dto.ctx, target.value.id, target.value.currentScript);
                        
                        //- Delay counter by 1
                        const modifyStatus = {...buff};
                        modifyStatus.args.counter++;
                        return modifyStatus;
                    }
                    return buff;
                })

                
                await this.statusService.updateEnemyStatuses(dto.ctx.expedition, target, {buff, debuff});

                const afterStatusesUpdateEvent: AfterStatusesUpdateEvent = {
                    ctx: dto.ctx,
                    source: target,
                    target,
                    collection: {buff, debuff},
                };

                //- Emit internal event
                await this.eventEmitter.emitAsync(
                    EVENT_AFTER_STATUSES_UPDATE,
                    afterStatusesUpdateEvent
                )
            }
        }

        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        // enemies.forEach(async enemy => {
        //     if(enemy.value.enemyId === deepDwellerMonsterData.enemyId){
        //         const status = enemy.value.statuses.buff.filter(s => s.name === chargingBeam.name)[0];
        //         if(status){
        //             if(status.args.counter === 1){
        //                 this.effectService.apply({
        //                     ctx: ctx,
        //                     source: enemy,
        //                     target: this.playerService.get(ctx),
        //                     effect: {
        //                         effect: damageEffect.name,
        //                         args: {
        //                             value: 45,
        //                         },
        //                     },
        //                 });
        //             }
        //         }
        //     }
        // });

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                chargingBeam,
            );
        }
    }
}