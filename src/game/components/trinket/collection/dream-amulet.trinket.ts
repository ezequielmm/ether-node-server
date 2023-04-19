

import { Prop } from '@typegoose/typegoose';
import { pull, sample } from 'lodash';
import {
    EVENT_AFTER_CREATE_COMBAT,
    EVENT_AFTER_INIT_COMBAT,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export class DreamAmuletTrinket extends Trinket {
    @Prop({ default: 35 })
    trinketId: number;

    @Prop({ default: 'Dream Amulet' })
    name: string;

    @Prop({ default: 'Draw 1 extra card each turn' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    cardsToDraw: number;

    async onAttach(ctx: GameContext): Promise<void> {
        // Once the combat is created, it is generated with the player's hand cards created
        // We can then add the extra card to the player's hand
        // The add card process is only necessary once, after modify the hand size will be
        // handled by the draw card process in the next player turn
        ctx.events.addListener(EVENT_AFTER_CREATE_COMBAT, async () => {
            const player = ctx.expedition.currentNode.data.player;

            for (let i = 0; i < this.cardsToDraw; i++) {
                // Get random card from draw pile
                const cardToDraw = sample(player.cards.draw);

                // Remove card from draw pile and add to hand
                player.cards.draw = pull(player.cards.draw, cardToDraw);
                player.cards.hand = [...player.cards.hand, cardToDraw];
            }

            // Update player hand size for the next turns
            player.handSize += this.cardsToDraw;

            ctx.expedition.markModified('currentNode.data.player');
            await ctx.expedition.save();

            this.trigger(ctx);
        });
    }
}

