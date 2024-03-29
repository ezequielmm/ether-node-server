import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from 'src/game/components/card/card.service';
import {
    FineEdgeCard,
    FineEdgeCardUpgraded,
} from 'src/game/components/card/data/fineEdge.card';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { sharpenBlade } from './constants';

@StatusDecorator({
    status: sharpenBlade,
})
@Injectable()
export class SharpenBladeStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(SharpenBladeStatus.name);

    constructor(
        private readonly cardService: CardService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, status } = dto;
        const card = await this.cardService.findById(
            status.args['upgraded']
                ? FineEdgeCardUpgraded.cardId
                : FineEdgeCard.cardId,
        );
        card.description = CardDescriptionFormatter.process(card);
        this.cardService.addStatusDescriptions(card);

        const cards: IExpeditionPlayerStateDeckCard[] = [];

        for (let i = 0; i < status.args.counter; i++) {
            cards.push({
                cardId: card.cardId,
                id: randomUUID(),
                name: card.name,
                description: card.description,
                rarity: card.rarity,
                energy: card.energy,
                cardType: card.cardType,
                pool: card.pool,
                properties: card.properties,
                keywords: card.keywords,
                isTemporary: false,
                showPointer: card.showPointer,
                isUpgraded: card.isUpgraded,
                isActive: true,
            });
        }

        // Add the cards to the player hand
        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            $push: {
                'currentNode.data.player.cards.hand': {
                    $each: cards,
                },
            },
        });

        // Update in memory cards
        ctx.expedition.currentNode.data.player.cards.hand.push(...cards);

        this.logger.log(
            ctx.info,
            `Added ${cards.length} ${card.name} cards to player hand`,
        );
    }
}
