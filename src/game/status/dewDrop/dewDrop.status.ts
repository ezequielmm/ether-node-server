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
        const round = ctx.expedition.currentNode.data.round;
        const cardPlayed = this.historyService.findLast(ctx.client.id, {
            type: 'card',
            round: round,
        });
        if(cardPlayed)
        {
            
            const all = this.historyService.get(ctx.client.id);
            const cards = [];
            all.forEach(c => {
                if(c.type == "card")
                {
                    cards.push(c);
                }
            });
            const cardsThisTurn = [];
            cards.forEach( card => {
                if(card.round == round)
                {
                    cardsThisTurn.push(card);
                }
            })
            let isDone = false;
            cardsThisTurn.forEach(card => {
                const isFirst = cardsThisTurn.indexOf(card) == 0;
                card.isFirstPlay = isFirst;
                if(isFirst && !isDone)
                {
                    if(eventArgs.card.energy > 0 )
                    {
                        const newEnergy =  eventArgs.card.energy;
                        eventArgs.card.energy = newEnergy - 1;
                        isDone = true;
                    }
                }
            })


        }

            
    }
}
