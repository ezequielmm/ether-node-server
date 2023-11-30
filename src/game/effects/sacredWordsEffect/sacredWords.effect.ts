import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { removeCardsFromPile } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { sacredWordEffect } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { forEach } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_BEFORE_ENEMY_INTENTIONS } from 'src/game/constants';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { CombatService } from 'src/game/combat/combat.service';
import { EffectService } from '../effects.service';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { isEmpty } from 'class-validator/types/decorator/common/IsEmpty';


@EffectDecorator({
    effect: sacredWordEffect,
})
@Injectable()
export class SacredWordEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
        private readonly enemyService: EnemyService,
        // private readonly eventEmitter: EventEmitter2,
        // @Inject(forwardRef(() => CombatService))
        // private readonly combatService: CombatService,
        // @Inject(forwardRef(() => EffectService))
        // private readonly effectService: EffectService,

    ) { }

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        this.enemyService.calculateNewIntentions(ctx);
        // const livingEnemies = await this.enemyService.getLiving(ctx);


        // // Then we loop over them and get their intentions and effects:
        // for (const enemy of livingEnemies) {

        //     const intentions = enemy.value.currentScript?.intentions;
        //     const source: ExpeditionEnemy = { type: CardTargetedEnum.Enemy, value: enemy.value };

        //     await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMY_INTENTIONS, { ctx, enemy });

        //     // Calcular un índice aleatorio dentro del rango del array de intentions
        //     const randomIndex = Math.floor(Math.random() * intentions.length);

        //     // Obtener el elemento aleatorio usando el índice generado
        //     const randomIntention = intentions[randomIndex];

        //     for (const intention of intentions) {
        //         const { effects } = intention;

        //         if (!isEmpty(effects)) {
        //             await this.effectService.applyAll({
        //                 ctx,
        //                 source,
        //                 effects,
        //                 selectedEnemy: enemy.value.id,
        //             });

        //             if (this.combatService.isCurrentCombatEnded(ctx)) {
        //                 logger.info('Combat ended, skipping rest of enemies, intentions and effects');
        //                 return;
        //             }
        //         }
        //     }
        // }


        // for (const item of livingEnemies) {
        //     const intentions = item.value.currentScript.intentions;

        //     // Verificar si el array de intentions no está vacío
        //     if (intentions.length > 0) {
        //         // Calcular un índice aleatorio dentro del rango del array de intentions
        //         const randomIndex = Math.floor(Math.random() * intentions.length);

        //         // Obtener el elemento aleatorio usando el índice generado
        //         const randomIntention = intentions[randomIndex];

        //         // Asignar el valor aleatorio al campo de la intención actual
        //         for (let newIntention of item.value.currentScript.intentions) {
        //             newIntention = randomIntention;
        //         }

        //         // Usar el valor aleatorio asignado como desees
        //         console.log('Intención actualizada:', item.value.currentScript.intentions);
        //     } else {
        //         console.log('El array de intentions está vacío.');
        //     }
        // }



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
