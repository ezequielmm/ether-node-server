import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { DamageDTO, IBaseEffect } from './effects.interface';
import { TargetId } from './effects.types';

@Effect(EffectName.Damage)
@Injectable()
export class DamageEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DamageDTO): Promise<void> {
        const {
            client,
            times,
            calculatedValue,
            targeted,
            targetId,
            useDefense,
            multiplier,
        } = payload;
        // TODO: Trigger damage attempted event

        for (let i = 1; i <= times; i++) {
            // Check targeted type
            switch (targeted) {
                case CardTargetedEnum.Enemy:
                    await this.applyDamageToEnemy(
                        client,
                        calculatedValue,
                        targetId,
                        useDefense,
                        multiplier,
                    );
                    break;
                case CardTargetedEnum.AllEnemies:
                    await this.applyDamageToAllEnemies(client, calculatedValue);
                    break;
            }
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
