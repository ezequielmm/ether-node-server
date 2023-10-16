import { Injectable } from "@nestjs/common";
import { Card } from "src/game/components/card/card.schema";
import { CardService } from "src/game/components/card/card.service";
import { CombatQueueService } from "src/game/components/combatQueue/combatQueue.service";
import { Expedition } from "src/game/components/expedition/expedition.schema";
import { PlayerService } from "src/game/components/player/player.service";
import { EffectDecorator } from "../effects.decorator";
import { AddCardPosition } from "../effects.enum";
import { EffectDTO } from "../effects.interface";
import { addConditionalCardEffect } from "./constants";
import { randomUUID } from "crypto";
import { CombatQueueTargetEffectTypeEnum } from "src/game/components/combatQueue/combatQueue.enum";
import { IExpeditionPlayerStateDeckCard } from "src/game/components/expedition/expedition.interface";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";

export interface AddCOnditionalCardArgs {
    destination: keyof Expedition['currentNode']['data']['player']['cards'];
    position: AddCardPosition;
    cardId: Card['cardId'];
    damage: number;
}

@EffectDecorator({
    effect: addConditionalCardEffect,
})
@Injectable()
export class AddConditionalCardEffect {
    constructor(
        private readonly playerService: PlayerService,
        private readonly cardService: CardService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO<AddCOnditionalCardArgs>): Promise<void> {
        const { target } = payload;

        if(PlayerService.isPlayer(target)){
            const damage = payload.args.damage;
            const defense   = target.value.combatState.defense;

            if(damage > defense){
                
                const {
                    ctx,
                    source,
                    target,
                    args: {
                        currentValue,
                        destination,
                        cardId,
                        position = AddCardPosition.Top,
                    },
                    action,
                } = payload;
            
                const { client } = ctx;

                // First we get the combat deck
                const {
                    value: {
                        combatState: { cards },
                    },
                } = this.playerService.get(ctx);
        
                // Now we get the card that we want to add to the current
                // node information
                const card = await this.cardService.findById(cardId);
        
                // Now we need to clone the card object x times based on the
                // currentValue parameter
                const cardsToAdd: IExpeditionPlayerStateDeckCard[] = Array(currentValue)
                    .fill(card)
                    .map((card) => ({
                        id: randomUUID(),
                        cardId: card.cardId,
                        name: card.name,
                        cardType: card.cardType,
                        energy: card.energy,
                        description: card.description,
                        isTemporary: false,
                        rarity: card.rarity,
                        properties: card.properties,
                        keywords: card.keywords,
                        showPointer: card.showPointer,
                        pool: card.pool,
                        isUpgraded: card.isUpgraded,
                        isActive: true,
                    }));
        
                // Check position
                switch (position) {
                    case AddCardPosition.Random:
                        // If it is random we need to add the cards in a random position
                        for (const card of cardsToAdd) {
                            const randomIndex = Math.floor(
                                Math.random() * cards[destination].length,
                            );
                            cards[destination].splice(randomIndex, 0, card);
                        }
                        break;
                    case AddCardPosition.Top:
                        // If it is top we need to add the cards to the top of the destination
                        cards[destination].unshift(...cardsToAdd);
                        break;
                    case AddCardPosition.Bottom:
                        // If it is bottom we need to add the cards to the bottom of the destination
                        cards[destination].push(...cardsToAdd);
                        break;
                }
        
                // Now we need to update the expedition state
                ctx.expedition.markModified('currentNode.data.player.cards');
                await ctx.expedition.save();
        
                await this.combatQueueService.push({
                    ctx,
                    source,
                    target,
                    args: {
                        effectType: CombatQueueTargetEffectTypeEnum.Status,
                        statuses: [],
                    },
                    action: action,
                });
        
                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.AddCard,
                        data: cardsToAdd.map((card) => ({
                            destination,
                            id: card.id,
                            card,
                        })),
                    }),
                );
            
            
            }
        }
    }

}