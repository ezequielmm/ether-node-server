import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { damageEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, EffectHandler } from './effects.interface';
import { EffectService } from './effects.service';
import { TargetId } from './effects.types';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            client,
            target,
            args: { currentValue, useDefense, multiplier },
        } = payload;
        // TODO: Trigger damage attempted event

        // Check targeted type
        if (EffectService.isEnemy(target)) {
            await this.applyDamageToEnemy(
                client,
                currentValue,
                target.value.id,
                useDefense,
                multiplier,
            );
        } else if (EffectService.isAllEnemies(target)) {
            await this.applyDamageToAllEnemies(client, currentValue);
        }
    }

    private async applyDamageToEnemy(
        client: Socket,
        damage: number,
        targetId: TargetId,
        useDefense: boolean,
        multiplier: number,
    ): Promise<void> {
        // Get enemy based on id
        const {
            data: {
                enemies,
                player: { defense },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        if (useDefense !== undefined && useDefense) {
            damage = defense * multiplier;
        }

        let dataResponse = null;

        enemies.forEach((enemy) => {
            const field = typeof targetId === 'string' ? 'id' : 'enemyId';

            if (enemy[field] === targetId) {
                enemy.hpCurrent = this.calculateDamage(
                    enemy.defense,
                    damage,
                    enemy.hpCurrent,
                );

                dataResponse = [
                    {
                        id: targetId,
                    },
                ];
            }
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({
            clientId: client.id,
            enemies,
        });

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAffected,
                    action: SWARAction.EnemyAffected,
                    data: dataResponse,
                }),
            ),
        );
    }

    private async applyDamageToAllEnemies(
        client: Socket,
        damage: number,
    ): Promise<void> {
        // Get all enemies of current node
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        let dataResponse = null;

        enemies.forEach((enemy) => {
            enemy.hpCurrent = this.calculateDamage(
                enemy.defense,
                damage,
                enemy.hpCurrent,
            );

            dataResponse = [];
            dataResponse.push({ id: enemy.id });
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({
            clientId: client.id,
            enemies,
        });

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAffected,
                    action: SWARAction.EnemyAffected,
                    data: dataResponse,
                }),
            ),
        );
    }

    private calculateDamage(
        enemyDefense: number,
        damageToApply: number,
        enemyHPCurrent: number,
    ): number {
        // If we check if the card uses the player's defense and a value for
        // the attack amount

        // Calculate true damage
        const trueDamage = Math.max(
            damageToApply - Math.max(enemyDefense, 0),
            0,
        );

        // If damage is less or equal to 0, trigger damage negated event
        // TODO: Trigger damage negated event

        // Calculate new hp
        return Math.max(0, enemyHPCurrent - trueDamage);

        // If new hp is less or equal than 0, trigger death event
        // TODO: Trigger death effect event
    }
}
