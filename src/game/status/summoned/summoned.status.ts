import { Injectable } from '@nestjs/common';
import { EnemyCategoryEnum } from 'src/game/components/enemy/enemy.enum';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/components/expedition/expedition.interface';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { summoned } from './constants';

interface SummonedData {
    enemy: IExpeditionCurrentNodeDataEnemy;
}

@StatusDecorator({
    status: summoned,
})
@Injectable()
export class SummonedStatus implements StatusEventHandler {
    async handle(dto: StatusEventDTO<SummonedData>): Promise<void> {
        const {
            ctx,
            eventArgs: { enemy },
        } = dto;

        // First we check if the enemy is a boss, otherwise we exit
        // the status
        if (enemy.category !== EnemyCategoryEnum.Boss) return;
    }
}
