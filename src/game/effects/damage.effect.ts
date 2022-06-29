import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { DamageDTO, IBaseEffect } from './effects.interface';
import { TargetId } from './effects.types';

@Effect(EffectName.Damage)
@Injectable()
export class DamageEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DamageDTO): Promise<void> {
        const { clientId, times, calculatedValue, targeted, targetId } =
            payload;
        // TODO: Triger damage attempted event

        for (let i = 1; i <= times; i++) {
            // Check targeted type
            switch (targeted) {
                case CardTargetedEnum.Enemy:
                    await this.applyDamageToEnemy(
                        clientId,
                        calculatedValue,
                        targetId,
                    );
                    break;
            }
        }
    }

    private async applyDamageToEnemy(
        clientId: string,
        damage: number,
        targetId: TargetId,
    ): Promise<void> {
        // Get enemy based on id
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: clientId,
        });

        enemies.forEach((enemy) => {
            const field = typeof targetId === 'string' ? 'id' : 'enemyId';

            if (enemy[field] === targetId) {
                // Calculate true damage
                const trueDamage = Math.max(
                    damage - Math.max(enemy.defense, 0),
                    0,
                );

                // If damage is less or equal to 0, trigger damage negated event
                // TODO: Trigger damage negated event

                // Calculate new hp
                enemy.hpCurrent = Math.max(0, enemy.hpCurrent - trueDamage);

                // If new hp is less or equal than 0, trigger death event
                // TODO: Trigger death effect event
            }

            return enemy;
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({ clientId, enemies });
    }
}
