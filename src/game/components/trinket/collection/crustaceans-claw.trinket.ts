import { Prop } from '@typegoose/typegoose';
import { map, sampleSize } from 'lodash';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { CardSelectionScreenOriginPileEnum } from '../../cardSelectionScreen/cardSelectionScreen.enum';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Crustacean's Claw Trinket
 */
export class CrustaceansClawTrinket extends Trinket {
    @Prop({ default: 14 })
    trinketId: number;

    @Prop({ default: "Crustacean's Claw" })
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
            const moveCardAction = ctx.moduleRef.get(MoveCardAction, {
                strict: false,
            });

            const cards = sampleSize(
                ctx.expedition.currentNode.data.player.cards.draw,
                this.cardsToDraw,
            );

            if (!cards.length) {
                return;
            }

            await moveCardAction.handle({
                client: ctx.client,
                cardIds: map(cards, 'id'),
                originPile: CardSelectionScreenOriginPileEnum.Draw,
                callback(card) {
                    card.energy = 0;
                    return card;
                },
            });
        });
    }
}
