import { Prop } from '@typegoose/typegoose';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { Card } from '../../card/card.schema';
import { CardService } from '../../card/card.service';
import { CardSelectionScreenOriginPileEnum } from '../../cardSelectionScreen/cardSelectionScreen.enum';
import { CardSelectionScreenService } from '../../cardSelectionScreen/cardSelectionScreen.service';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

const MAX_CARDS_TO_SHOW = 5;

/**
 * Runict Tome Trinket
 */
export class RunicTomeTrinket extends Trinket {
    @Prop({ default: 23 })
    trinketId: number;

    @Prop({ default: 'Runic Tome' })
    name: string;

    @Prop({
        default: 'On pickup, choose up to 2 of 5 cards to add to your deck',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    @Prop({ default: 2 })
    cardsToTake: number;

    @Prop({ default: false })
    used: boolean;

    async onAttach(ctx: GameContext): Promise<void> {
        // If the trinket has already been used, we don't need to do anything
        if (this.used) {
            return;
        }

        const moduleRef = ctx.moduleRef;

        const opts = { strict: false };

        const cardSelectionScreenService = moduleRef.get(
            CardSelectionScreenService,
            opts,
        );
        const cardService = moduleRef.get(CardService, opts);

        const cards: Card[] = [];

        for (let i = 0; i < MAX_CARDS_TO_SHOW; i++) {
            const card = await cardService.getRandomCard();
            cards.push(card);
        }

        await cardSelectionScreenService.deleteByClientId(ctx.client.id);
        await cardSelectionScreenService.create({
            clientId: ctx.client.id,
            cardIds: cards.map(({ cardId }) => cardId),
            originPile: CardSelectionScreenOriginPileEnum.None,
            amountToTake: this.cardsToTake,
        });

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.ShowCardDialog,
                data: {
                    cards: cards,
                    cardsToTake: this.cardsToTake,
                },
            }),
        );

        // Mark the trinket as used
        this.used = true;
        ctx.expedition.markModified('playerState.trinkets');

        // Save the expedition
        await ctx.expedition.save();
    }
}
