import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventHandler, StatusEventDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEventHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, target, status, update, remove } = dto;

        let finalDefense: number;
        if (PlayerService.isPlayer(target)) {
            finalDefense = target.value.combatState.defense + status.args.value;
            this.playerService.setDefense(ctx, finalDefense);
        } else if (EnemyService.isEnemy(target)) {
            finalDefense = target.value.defense + status.args.value;
            this.enemyService.setDefense(ctx, target.value.id, finalDefense);
        }

        status.args.value--;

        if (status.args.value <= 0) {
            remove();
        } else {
            update({
                value: status.args.value,
            });
        }

        await this.combatQueueService.push({
            ctx,
            source: target,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Defense,
                defenseDelta: status.args.value,
                finalDefense: finalDefense,
                healthDelta: undefined,
                finalHealth: undefined,
                statuses: [],
            },
        });
    }
}
