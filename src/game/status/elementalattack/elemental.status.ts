import { OnEvent } from '@nestjs/event-emitter';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_AFTER_ENEMIES_TURN_END, } from 'src/game/constants';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { elementalAttackStatus } from './constants';

@StatusDecorator({
    status: elementalAttackStatus,
})
export class SpiritAssaultStatus implements StatusEffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
    ) {}

    preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        const { effectDTO } = dto;
        
        if (typeof effectDTO.args.type === 'undefined' || effectDTO.args.type.length == 0) {
            effectDTO.args.currentValue = effectDTO.args.initialValue;
        } else 
        {
            effectDTO.args.currentValue = effectDTO.args.initialValue;
        }

        return effectDTO;
    }

    @OnEvent(EVENT_AFTER_ENEMIES_TURN_END)
    async onEnemiesTurnEnd(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        //getting player
        const player = this.playerService.get(ctx); 
        const statuses = player.value.combatState.statuses;

            await this.statusService.decreaseCounterAndRemove(
                ctx,
                statuses,
                player,
                elementalAttackStatus, 
            );
    }
}

