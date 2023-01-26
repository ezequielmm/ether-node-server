import { Injectable } from '@nestjs/common';
import { filter } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EndCombatProcess } from 'src/game/process/endCombat.process';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { fleeEffect } from './constants';

@EffectDecorator({
    effect: fleeEffect,
})
@Injectable()
export class FleeEffect implements EffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly endCombatProcess: EndCombatProcess,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        const {
            target,
            ctx,
            ctx: {
                client,
                expedition: {
                    currentNode: {
                        // We know that the target is the enemy we have to remove from the enemies array
                        // We query that array first to remove it and then evaluate
                        data: { enemies },
                    },
                },
            },
        } = payload;

        // Here we remove the enemy from the enemies array
        // and we update the enemies array on the expedition
        ctx.expedition.currentNode.data.enemies = filter(
            enemies,
            (enemy) => enemy.id !== target.value.id,
        );

        ctx.expedition.markModified('currentNode.data.enemies');
        await ctx.expedition.save();

        // Now we send a message to remove the enemy from the screen
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.RemoveEnemies,
                data: [target],
            }),
        );

        const areAllEnemiesDead = this.enemyService.isAllDead(ctx);

        if (areAllEnemiesDead) await this.endCombatProcess.handle({ ctx });
    }
}
