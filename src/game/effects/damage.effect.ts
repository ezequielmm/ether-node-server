import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GetPlayerInfoAction } from '../action/getPlayerInfo.action';
import { CardTargetedEnum } from '../components/card/card.enum';
import { IExpeditionCurrentNodeDataEnemy } from '../components/expedition/expedition.interface';
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
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
    ) {}

    async handle(payload: DamageDTO): Promise<void> {
        const {
            client,
            times,
            calculatedValue: damage,
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
                        damage,
                        targetId,
                        useDefense,
                        multiplier,
                    );
                    break;
                case CardTargetedEnum.AllEnemies:
                    await this.applyDamageToAllEnemies(client, damage);
                    break;
                case CardTargetedEnum.Player:
                    await this.applyDamageToPlayer(client, damage);
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
        const { defense, hpCurrent } = await this.getPlayerInfoAction.handle(
            client.id,
        );

        // Them we check if the player has defense to reduce from there
        let newDefense = 0;
        let newHpCurrent = 0;

        if (defense > 0) {
            newDefense = defense - damage;

            if (newDefense < 0) {
                newDefense = 0;
                newHpCurrent = Math.max(0, hpCurrent + newDefense);
            }
        } else {
            newHpCurrent = Math.max(0, hpCurrent - damage);
        }

        await this.expeditionService.setPlayerDefense({
            clientId: client.id,
            value: newDefense,
        });

        await this.expeditionService.setPlayerHealth({
            clientId: client.id,
            hpCurrent: newHpCurrent,
        });
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
