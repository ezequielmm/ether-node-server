import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { chooseCardEffect } from 'src/game/effects/chooseCard/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { birdcageStatus } from 'src/game/status/birdcage/constants';
import { StatusService } from 'src/game/status/status.service';
import { CardService } from '../../card/card.service';
import { CardSelectionScreenOriginPileEnum } from '../../cardSelectionScreen/cardSelectionScreen.enum';
import { CardSelectionScreenService } from '../../cardSelectionScreen/cardSelectionScreen.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
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

    async onAttach(ctx: GameContext): Promise<void> {
        const moduleRef = ctx.moduleRef;

        const opts = { strict: false };

        const effectService = moduleRef.get(EffectService, opts);
        const playerService = moduleRef.get(PlayerService, opts);
        const cardService = moduleRef.get(CardService);

        const cards = [];

        for (let i = 0; i < MAX_CARDS_TO_SHOW; i++) {
            const card = await cardService.getRandomCard();
            cards.push(card);
        }

        const player = playerService.get(ctx);

        await effectService.apply({
            ctx,
            source: player,
            target: player,
            effect: {
                effect: chooseCardEffect.name,
                args: {
                    value: this.cardsToTake,
                    originPile: CardSelectionScreenOriginPileEnum.None,
                },
            },
        });
    }
}
