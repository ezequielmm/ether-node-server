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

export interface AddCardArgs {
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

    async handle(payload: EffectDTO<AddCardArgs>): Promise<void> {
        //- TODO:

    }

}