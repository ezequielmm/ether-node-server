import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/components/expedition/expedition.interface';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { stunned } from './constants';

@StatusDecorator({
    status: stunned,
})
@Injectable()
export class StunnedStatus implements StatusEventHandler {
    private readonly logger = new Logger(StunnedStatus.name);

    async handle(dto: StatusEventDTO): Promise<any> {
        const { target, eventArgs: args } = dto;
        const enemy = args.enemy as IExpeditionCurrentNodeDataEnemy;

        if (EnemyService.isEnemy(target) && target.value.id == enemy.id) {
            this.logger.debug(`Stunned ${enemy.name}:${enemy.id}`);

            // Remove effects of the enemy's intentions in memory
            for (const intention of enemy.currentScript.intentions) {
                intention.effects = [];
            }

            // Remove effects of the enemy's actions.
            dto.remove();
        }
    }
}
