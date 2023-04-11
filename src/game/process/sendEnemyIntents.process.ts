import { Injectable } from '@nestjs/common';
import { EnemyIntentionType } from '../components/enemy/enemy.enum';
import { GameContext } from '../components/interfaces';
import { EffectService } from '../effects/effects.service';
import { damageEffect } from '../effects/damage/constants';
import { EnemyService } from '../components/enemy/enemy.service';

interface EnemyIntentsResponse {
    id: string;
    intents: {
        value?: number;
        description?: string;
        type?: EnemyIntentionType;
    }[];
}

@Injectable()
export class SendEnemyIntentProcess {
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(ctx: GameContext): Promise<EnemyIntentsResponse[]> {
        const intentValues: EnemyIntentsResponse[] = [];
        const allEnemies = this.enemyService.getAll(ctx);
        const enemies = allEnemies.filter((enemy) => enemy.value.hpCurrent > 0);

        for await (const enemy of enemies) {
            const enemyIntent: EnemyIntentsResponse = {
                id: enemy.value.id,
                intents: [],
            };

            for await (const intent of enemy.value.currentScript.intentions) {
                let value = intent.value;

                if (intent.type === EnemyIntentionType.Attack) {
                    let newValue = 0;
                    const effects = intent.effects ?? [];

                    for await (const effect of effects) {
                        if (effect.effect !== damageEffect.name) continue;

                        const preview =
                            await this.effectService.preview({
                                ctx,
                                dto: {
                                    ctx,
                                    source: enemy,
                                    args: {
                                        initialValue:
                                            effect.args.value ?? 0,
                                        currentValue:
                                            effect.args.value ?? 0,
                                    },
                                },
                                effect: effect.effect,
                            });

                        newValue += preview.args.currentValue;
                    }
                    value = newValue;
                }

                enemyIntent.intents.push({
                    ...(intent.type === EnemyIntentionType.Attack && {
                        value,
                    }),
                    description: this.descriptionGenerator(
                        intent.type,
                        value,
                    ),
                    type: intent.type,
                });
            }  

            intentValues.push(enemyIntent);
        }

        return intentValues;
    }

    private descriptionGenerator(
        intent: EnemyIntentionType,
        value?: number,
    ): string {
        switch (intent) {
            case EnemyIntentionType.Attack:
                return `This Enemy will attack for ${value} Damage`;
            case EnemyIntentionType.Defend:
                return `This Enemy will Defend`;
            case EnemyIntentionType.Buff:
                return `This Enemy is plotting to gain a Buff effect`;
            case EnemyIntentionType.Debuff:
                return `This Enemy is scheming to apply a Debuff effect`;
            default:
                return `Unknown intentions`;
        }
    }
}
