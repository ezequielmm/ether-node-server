import { Injectable } from '@nestjs/common';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { drained } from './constants';

@StatusDecorator({
    status: drained,
})
@Injectable()
export class DrainedStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, source, target, eventArgs: args, remove } = dto;

        let finalDefense: number;

        if (PlayerService.isPlayer(target)) {
            finalDefense = target.value.combatState.defense - args.value;
            await this.playerService.setDefense(ctx, finalDefense);
        } else if (EnemyService.isEnemy(target)) {
            finalDefense = target.value.defense - args.value;
            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                finalDefense,
            );
        }

        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Defense,
                defenseDelta: args.value,
                finalDefense: finalDefense,
                healthDelta: undefined,
                finalHealth: undefined,
                statuses: [],
            },
        });

        remove();
    }
}
