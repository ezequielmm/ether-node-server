import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GetPlayerInfoAction } from '../action/getPlayerInfo.action';
import { IExpeditionCurrentNodeDataEnemy } from '../components/expedition/expedition.interface';
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
    private readonly logger: Logger = new Logger(DamageEffect.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
    ) {}

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
        } else if (EffectService.isPlayer(target)) {
            await this.applyDamageToPlayer(client, currentValue);
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

        if (useDefense !== undefined && useDefense)
            damage = defense * multiplier;

        let dataResponse = null;

        enemies.forEach((enemy) => {
            const field = typeof targetId === 'string' ? 'id' : 'enemyId';

            if (enemy[field] === targetId) {
                enemy = this.calculateEnemyDamage(enemy, damage);

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

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.EnemyAffected}`,
        );

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
            enemy = this.calculateEnemyDamage(enemy, damage);

            dataResponse = [];
            dataResponse.push({ id: enemy.id });
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({
            clientId: client.id,
            enemies,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.EnemyAffected}`,
        );

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

    private async applyDamageToPlayer(
        client: Socket,
        damage: number,
    ): Promise<void> {
        // First we get the actual hp and defense from the player
        const { defense: currentDefense, hpCurrent } =
            await this.getPlayerInfoAction.handle(client.id);

        let newDefense = 0;
        let newHpCurrent = 0;

        // Them we check if the player has defense to reduce from there
        if (currentDefense > 0) {
            newDefense = currentDefense - damage;

            // If newDefense is negative, it means that the defense is fully
            // depleted and the remaining will be applied to the player's health
            if (newDefense < 0) {
                newDefense = 0;
                newHpCurrent = Math.max(0, hpCurrent + newDefense);
            }
        } else {
            // If the player has no defense, the damage will be applied to the
            // health directly
            newHpCurrent = Math.max(0, hpCurrent - damage);
        }

        // Update the player's defense
        await this.expeditionService.setPlayerDefense({
            clientId: client.id,
            value: newDefense,
        });

        // Update the player's health
        await this.expeditionService.setPlayerHealth({
            clientId: client.id,
            hpCurrent: newHpCurrent,
        });

        const playerInfo = await this.getPlayerInfoAction.handle(client.id);

        // Send player message
        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.EnemyAffected}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdatePlayer,
                    data: playerInfo,
                }),
            ),
        );
    }

    private calculateEnemyDamage(
        enemy: IExpeditionCurrentNodeDataEnemy,
        damage: number,
    ): IExpeditionCurrentNodeDataEnemy {
        // First we check if the enemy has defense
        if (enemy.defense > 0) {
            // if is true, then we reduce the damage to the defense
            const newDefense = enemy.defense - damage;

            // Next we check if the new defense is lower than 0
            // and use the remaining value to reduce to the health
            // and the set the defense to 0
            if (newDefense < 0) {
                enemy.defense = 0;
                enemy.hpCurrent = Math.max(0, enemy.hpCurrent + newDefense);
            } else {
                // Otherwise, we update the defense with the new value
                enemy.defense = newDefense;
            }
        } else {
            // Otherwise, we apply the damage to the enemy's health
            enemy.hpCurrent = Math.max(0, enemy.hpCurrent - damage);
        }

        return enemy;
    }
}
