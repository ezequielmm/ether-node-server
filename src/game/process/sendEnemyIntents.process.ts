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
        negateDamage?:number;
        name?: string;
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
        const enemies = this.enemyService.getLiving(ctx);

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

                        const preview = await this.effectService.preview({
                            ctx,
                            dto: {
                                ctx,
                                source: enemy,
                                args: {
                                    initialValue: effect.args.value ?? 0,
                                    currentValue: effect.args.value ?? 0,
                                },
                            },
                            effect: effect.effect,
                        });

                        newValue += preview.args.currentValue;
                    }
                    value = newValue;
                }

                enemyIntent.intents.push({
                    ...(intent.type === EnemyIntentionType.Attack && { value }),
                    description: this.descriptionGenerator(intent.type, value),
                    type: intent.type,
                    negateDamage: intent.negateDamage,
                    name: intent.name
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
                return `This Enemy will defend`;
            case EnemyIntentionType.Buff:
                return `This Enemy is plotting to gain a Buff effect`;
            case EnemyIntentionType.Debuff:
                return `This Enemy is scheming to apply a Debuff effect`;
            case EnemyIntentionType.Signature:
                return `This creature is plotting to use a unique and powerful skill. Hit it hard before it hits you!`;
            case EnemyIntentionType.Breach:
                return `This enemy is planning to breach through your defenses!`;
            case EnemyIntentionType.Counter:
                return `This enemy will return the next attack and then some… if it survives…`;
            case EnemyIntentionType.Absorb:
                return `This enemy will absorb the energy of incoming attacks and use it to heal itself.`;
            case EnemyIntentionType.Infect:
                return `This enemy is plotting to infect you with an incapacitating disease.`;
            case EnemyIntentionType.Grow:
                return "This enemy is plotting to grow into a larger, pumped up version of itself.";
            case EnemyIntentionType.Mistify:
                return "This creature is plotting to play wicked tricks with your mind.";
            case EnemyIntentionType.Reinforcements:
                return `This creature is plotting to summon additional help.`;
            case EnemyIntentionType.DoNothing:
                return "";
            default:
                return `Unknown intentions`;
        }
    }
}
