import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { isNotUndefined } from 'src/utils';
import { getEnemyIdField } from '../../components/enemy/enemy.type';
import { IExpeditionCurrentNodeDataEnemy } from '../../components/expedition/expedition.interface';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../../standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { TargetId } from '../effects.types';
import { damageEffect } from './constants';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
    useEnergyAsValue?: boolean;
    useEnergyAsMultiplier?: boolean;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(DamageEffect.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
    ) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            client,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
            },
            expedition: {
                currentNode: {
                    data: {
                        player: { energy: currentEnergy },
                    },
                },
            },
        } = payload;

        const ctx: Context = {
            client,
            expedition: payload.expedition as ExpeditionDocument,
        };

        // Check targeted type
        if (EffectService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const newCurrentValue = isNotUndefined(useEnergyAsMultiplier)
                ? currentValue * currentEnergy
                : currentValue;

            await this.applyDamageToEnemy(
                client,
                newCurrentValue,
                target.value.id,
                useDefense,
                multiplier,
            );
        }

        if (EffectService.isAllEnemies(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const newCurrentValue = isNotUndefined(useEnergyAsMultiplier)
                ? currentValue * currentEnergy
                : currentValue;

            await this.applyDamageToAllEnemies(client, newCurrentValue);
        }

        if (EffectService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const newCurrentValue = isNotUndefined(useEnergyAsValue)
                ? currentEnergy
                : currentValue;

            await this.playerService.damage(ctx, newCurrentValue);
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

        if (isNotUndefined(useDefense)) damage = defense * multiplier;

        const dataResponse = [];

        enemies.forEach((enemy) => {
            if (enemy[getEnemyIdField(targetId)] === targetId) {
                enemy = this.calculateEnemyDamage(enemy, damage);

                dataResponse.push({
                    id: targetId,
                });
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

        const dataResponse = [];

        enemies.forEach((enemy) => {
            enemy = this.calculateEnemyDamage(enemy, damage);
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
                enemy.hpCurrent = Math.max(0, enemy.hpCurrent + newDefense);
                enemy.defense = 0;
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
