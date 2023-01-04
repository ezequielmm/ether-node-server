import { Injectable } from '@nestjs/common';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { peacockFeatherStatus } from './constants';
import { CardService } from 'src/game/components/card/card.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { GetPlayerInfoAction } from 'src/game/action/getPlayerInfo.action';

@StatusDecorator({
    status: peacockFeatherStatus,
})
@Injectable()
export class PeacockFeatherStatus implements StatusEventHandler {
    constructor(
        private readonly cardService: CardService,
        private readonly expeditionService: ExpeditionService,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const {
            ctx,
            ctx: {
                expedition: {
                    currentNode: {
                        data: {
                            player: {
                                cards: { hand, draw, discard, exhausted },
                            },
                        },
                    },
                },
            },
            status: { args },
        } = dto;

        if (args.counter > 0 && args.counter < args.value) {
            args.counter++;
            dto.update(args);
            return;
        }

        let newHand: IExpeditionPlayerStateDeckCard[];
        let newDiscard: IExpeditionPlayerStateDeckCard[];

        if (args.counter == 0) {
            const cards = await this.cardService.findAll();
            const cards_data = {};
            for (let i = 0; i < cards.length; i++) {
                cards_data[cards[i].cardId] = cards[i];
            }

            newHand = hand.map((card) => {
                card.energy = cards_data[card.cardId].energy;
                return card;
            });

            newDiscard = discard.map((card) => {
                card.energy = cards_data[card.cardId].energy;
                return card;
            });
            args.counter = 1;
            dto.update(args);
        }
        if (args.counter == args.value) {
            newHand = hand.map((card) => {
                card.energy = 0;
                return card;
            });

            newDiscard = discard.map((card) => {
                card.energy = 0;
                return card;
            });
            args.counter = 0;
            dto.update(args);
        }

        await this.expeditionService.updateHandPiles({
            hand: newHand,
            draw: newDiscard,
        });

        // Send updated player information
        const playerInfo = await this.getPlayerInfoAction.handle(ctx.client.id);

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdatePlayer,
                data: playerInfo,
            }),
        );
    }
}
