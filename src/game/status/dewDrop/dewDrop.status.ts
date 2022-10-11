import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/game/history/history.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { dewDropStatus } from './constants';

@StatusDecorator({
    status: dewDropStatus,
})
@Injectable()
export class DewDropStatus implements StatusEventHandler {
    constructor(private readonly historyService: HistoryService) {}

    async handle(args: StatusEventDTO): Promise<any> {
        const { ctx, eventArgs } = args;

        const cardPlayed = this.historyService.findLast(ctx.client.id, {
            type: 'card',
            round: ctx.expedition.currentNode.data.round,
        });

        if (!cardPlayed) eventArgs.card.energy -= 1;
    }
}
