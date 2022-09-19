import { filter } from 'lodash';
import { CardTypeEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { stunned } from 'src/game/status/stunned/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { knockDown } from './constants';

@EffectDecorator({
    effect: knockDown,
})
export class KnockDownEffect implements EffectHandler {
    constructor(
        private readonly historyService: HistoryService,
        private readonly statusService: StatusService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source, target } = dto;
        const history = this.historyService.get(ctx.client.id);

        // Get cards played by the client
        const cardsPlayed = filter(history, {
            type: 'card',
        }) as CardRegistry[];

        if (cardsPlayed.length < 2) {
            return;
        }

        // Get the last two cards played by the client
        const [lastCard, secondLastCard] = cardsPlayed.slice(-2);

        // If the two cards played are of attack type, then the client is knocked down
        if (
            EnemyService.isEnemy(target) &&
            lastCard.card.cardType === CardTypeEnum.Attack &&
            secondLastCard.card.cardType === CardTypeEnum.Attack
        ) {
            await this.statusService.attach({
                ctx,
                source,
                statuses: [
                    {
                        name: stunned.name,
                        args: {
                            value: 1,
                            attachTo: target.type,
                        },
                    },
                ],
                targetId: target.value.id,
            });
        }
    }
}
