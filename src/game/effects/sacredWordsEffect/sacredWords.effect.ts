import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { removeCardsFromPile } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { sacredWordEffect } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { forEach } from 'lodash';

@EffectDecorator({
    effect: sacredWordEffect,
})
@Injectable()
export class SacredWordEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
        private readonly enemyService: EnemyService,
    ) { }

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        const livingEnemies = await this.enemyService.getLiving(ctx);

        for (const item of livingEnemies) {
            const intentions = item.value.currentScript.intentions;
        
            // Verificar si el array de intentions no está vacío
            if (intentions.length > 0) {
                // Calcular un índice aleatorio dentro del rango del array de intentions
                const randomIndex = Math.floor(Math.random() * intentions.length);
        
                // Obtener el elemento aleatorio usando el índice generado
                const randomIntention = intentions[randomIndex];
        
                // Asignar el valor aleatorio al campo de la intención actual
                for(let newIntention of item.value.currentScript.intentions)
                {
                    newIntention = randomIntention;
                } 
        
                // Usar el valor aleatorio asignado como desees
                console.log('Intención actualizada:', item.value.currentScript.intentions);
            } else {
                console.log('El array de intentions está vacío.');
            }
        }
        


        console.log("::::::::::::::::::::FUNCIONA EFECTO SACRED WORDS::::::::::::::::::");

        // // // // // // Get the card that was played by history service and move it
        // // // // // // to the draw pile
        // // // // // const card = this.historyService.findLast<CardRegistry>(ctx.client.id, {
        // // // // //     type: 'card',
        // // // // //     card: {},
        // // // // // });

        // // // // // if (!card)
        // // // // //     throw new Error('Card Autonomous Weapon not found in history');

        // // // // // const { discard, draw } = ctx.expedition.currentNode.data.player.cards;

        // // // // // // Add the card to the draw pile
        // // // // // draw.push(card.card);
        // // // // // // Remove the card from the discard pile
        // // // // // ctx.expedition.currentNode.data.player.cards.discard =
        // // // // //     removeCardsFromPile({
        // // // // //         originalPile: discard,
        // // // // //         cardsToRemove: [card.card],
        // // // // //     });

        // // // // // // Update the expedition
        // // // // // await this.expeditionService.updateHandPiles({
        // // // // //     clientId: ctx.client.id,
        // // // // //     draw,
        // // // // //     discard,
        // // // // // });
    }
}
