import { Prop } from '@typegoose/typegoose';
import { map, sampleSize } from 'lodash';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { CardSelectionScreenOriginPileEnum } from '../../cardSelectionScreen/cardSelectionScreen.enum';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Ether Crystal Trinket
 */
export class EtherCrystalTrinket extends Trinket {
    @Prop({ default: 71 })
    trinketId: number;

    @Prop({ default: "Ether Crystal" })
    name: string;

    @Prop({
        default:
            'At the beginning of combat, draw 1 extra card.',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Uncommon })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    cardsToDraw: number;

    async onAttach(ctx: GameContext): Promise<void> {
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
                
            });
        });
    }
}
