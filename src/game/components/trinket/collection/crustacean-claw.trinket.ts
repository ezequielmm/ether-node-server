import { Prop } from '@typegoose/typegoose';
import { map, sampleSize } from 'lodash';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../../expedition/expedition.service';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export class CrustaceanClawTrinket extends Trinket {
    @Prop({ default: 14 })
    trinketId: number;

    @Prop({ default: `Crustacean's Claw` })
    name: string;

    @Prop({
        default:
            'At the beginning of combat, draw 1 extra card, which costs 0 this turn',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Uncommon })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    cardsToDraw: number;

    onAttach(ctx: GameContext): void {
        ctx.events.addListener(EVENT_AFTER_INIT_COMBAT, async () => {
            const decks = ctx.expedition.currentNode.data.player.cards;
            const drawPile = decks.draw;
            const handPile = decks.hand;

            const expeditionService = ctx.moduleRef.get(ExpeditionService, {
                strict: false,
            });

            // Take the random cards from the draw pile
            const cardsToMove = sampleSize(drawPile, this.cardsToDraw);

            // now we update the new decks
            const newHand = [...handPile, ...cardsToMove];
            const newDraw = removeCardsFromPile({
                originalPile: drawPile,
                cardsToRemove: cardsToMove,
            });

            // Now we save those on the hand pile
            await expeditionService.updateHandPiles({
                clientId: ctx.client.id,
                hand: newHand,
                draw: newDraw,
            });

            // Now we send the message to let the frontend know the new cards
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.MoveCard,
                    data: map(cardsToMove, (card) => ({
                        source: 'draw',
                        destination: 'hand',
                        id: card.id,
                    })),
                }),
            );
        });
    }
}
