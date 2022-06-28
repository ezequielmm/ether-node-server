import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from '../components/card/enums';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './decorators/effect.decorator';
import { DamageDTO } from './dto';
import { EffectName, IBaseEffect } from './interfaces/baseEffect';

@Effect(EffectName.Damage)
@Injectable()
export class DamageEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DamageDTO): Promise<void> {
        const { client_id, times, value, targeted, targeted_id } = payload;
        // TODO: Triger damage attempted event

        for (let i = 0; i < (times || 1); i++) {
            // Check targeted type
            if (targeted === CardTargetedEnum.Player) {
                await this.applyDamageToPlayer(client_id, value);
            } else if (targeted === CardTargetedEnum.Enemy) {
                await this.applyDamageToEnemy(client_id, value, targeted_id);
            } else if (targeted === CardTargetedEnum.AllEnemies) {
                // TODO: Find all enemies and apply damage
            } else if (targeted === CardTargetedEnum.RandomEnemy) {
                // TODO: Find random enemy and apply damage
            } else if (targeted === CardTargetedEnum.None) {
                // TODO: ???
            }
        }
    }

    private async applyDamageToPlayer(
        clientId: string,
        damage: number,
    ): Promise<void> {
        // NOTE: We can get player data and hp_current in one query, but we'll do it this way for now

        // Get player defense
        const {
            data: { player },
        } = await this.expeditionService.getCurrentNodeByClientId(clientId);

        const { hp_current } =
            await this.expeditionService.getPlayerStateByClientId({
                client_id: clientId,
            });

        // Calculate true damage
        const trueDamage = damage - (player.defense || 0);

        // If damage is less or equal to 0, trigger damage negated event
        if (trueDamage <= 0) {
            // TODO: Trigger damage negated event
            return;
        }

        // Calculate new hp
        const newHp = hp_current - trueDamage;

        // TODO: If new hp is less or equal than 0,  trigger death event

        // Update player hp
        await this.expeditionService.updatePlayerHp({
            client_id: clientId,
            hp: newHp,
        });
    }

    private async applyDamageToEnemy(
        clientId: string,
        damage: number,
        target: string | number,
    ): Promise<void> {
        // Get enemy based on id
        const enemies = await this.expeditionService.getCombatEnemies({
            client_id: clientId,
        });

        const { defense, hpMin } = enemies.filter((enemy) => {
            if (typeof target === 'string') {
                return enemy.id === target;
            } else {
                return enemy.enemyId === target;
            }
        })[0];

        // Calculate true damage
        const trueDamage = damage - (defense || 0);

        // If damage is less or equal to 0, trigger damage negated event
        // TODO: Trigger damage negated event

        // Calculate new hp
        const newHp = Math.max(0, hpMin - trueDamage);
        console.log({ newHp });

        // If new hp is less or equal than 0,  trigger death event
        // TODO: Trigger death effect event

        // update enemy health
        await this.expeditionService.updateEnemyHp({
            client_id: clientId,
            enemy_id: target,
            hp: newHp,
        });
    }
}
