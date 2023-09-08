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
import { CardTargetedEnum } from "src/game/components/card/card.enum";

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
        
        const { ctx, effectDTO } = dto;
        const originalAttack  = effectDTO.args.currentValue;

        if(effectDTO.source.type == CardTargetedEnum.Player){
            //- For Incoming
            //- Incoming effect of Hiddent status is getting 25/ less damage:
            if(originalAttack && originalAttack > 0){
                effectDTO.args.currentValue = Math.floor(originalAttack / 1.25);
            }
        }else{
            //- For Outgoing:
            //- Outgoing effect of Hidden status is make 25% more damage to player defense.
            const player = this.playerService.get(ctx);
            const originalDefense = player.value.combatState.defense

            if(originalDefense && originalDefense > 0 && originalAttack && originalAttack > 0){
                if(originalAttack >= originalDefense){
                    const newAttack = Math.floor(originalDefense * 1.25) + (originalAttack - originalDefense);
                    effectDTO.args.currentValue = newAttack;
                }else{
                    let newAttack = Math.floor(originalAttack * 1.25);
                    if(newAttack > originalDefense){
                        newAttack = Math.floor((newAttack - originalDefense) / 1.25) + (newAttack - originalDefense);    
                    }
                    effectDTO.args.currentValue = newAttack;
                }
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
                hiddenStatus,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart(args: { ctx: GameContext }): Promise<void> {
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