import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEqual, reject } from 'lodash';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { StatusService } from 'src/game/status/status.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { bolstered } from './constants';

@StatusDecorator({
    status: bolstered,
})
@Injectable()
export class BolsteredStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(BolsteredStatus.name);
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(args: StatusEventDTO): Promise<void> {
        const { source, target, ctx,
            status: {
                args: { counter: value },
            },
        } = args;

        let finalDefense: number;

        console.log("Bolster status:")

        if (PlayerService.isPlayer(target)) {
            finalDefense = target.value.combatState.defense + value;
            await this.playerService.setDefense(ctx, finalDefense);
        } 
        else if (EnemyService.isEnemy(target)) {
            finalDefense = target.value.defense + value;
            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                finalDefense,
            );
        }

        console.log("final Defense: " + finalDefense)

        // await this.combatQueueService.push({
        //     ctx,
        //     source,
        //     target,
        //     args: {
        //         effectType: CombatQueueTargetEffectTypeEnum.Defense,
        //         defenseDelta: value,
        //         finalDefense: finalDefense,
        //         healthDelta: undefined,
        //         finalHealth: undefined,
        //         statuses: [],
        //     },
        // });
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async remove(args: { ctx: GameContext }): Promise<void> {
        console.log("Before Player Turn End executed................")
        const { ctx } = args;
        const statuses = this.statusService.getAllByName(ctx, bolstered.name);

        for (const status of statuses) {
            const buffStatuses = reject(status.statuses.buff, {
                name: bolstered.name,
            });

            if (isEqual(buffStatuses, status.statuses.buff)) {
                continue;
            }

            status.statuses.buff = buffStatuses;

            // Update status collection
            this.logger.log(
                ctx.info,
                `Removing status 'bolstered' from ${status.target.type}`,
            );

            await this.statusService.updateStatuses(
                ctx,
                status.target,
                status.statuses,
            );
        }
    }
}
