import { Injectable } from '@nestjs/common';
import { EnemyService } from 'dist/game/components/enemy/enemy.service';
import { EnemyIntentionType } from '../components/enemy/enemy.enum';
import { GameContext } from '../components/interfaces';
import { EffectService } from '../effects/effects.service';
import { damageEffect } from '../effects/damage/constants';

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
        const enemies = this.enemyService.getAll(ctx);

        for(let enemyIndex = 0; enemyIndex < enemies.length; ++enemyIndex) {
            const enemy = enemies[enemyIndex];
            let enemyIntent: EnemyIntentsResponse = {
                id: enemy.value.id,
                intents: []
            };
            
            for (let intentIndex = 0; intentIndex < enemy.value.currentScript.intentions.length ?? 0; ++intentIndex) {
                const intent = enemy.value.currentScript.intentions[intentIndex];
                let value = intent.value;

                if (intent.type === EnemyIntentionType.Attack) {
                    const effects = intent.effects ?? [];
                    for (let effectIndex = 0; effectIndex < intent.effects.length ?? 0; ++effectIndex) {
                        if (effects[effectIndex].effect == damageEffect.name) {
                            const preview = await this.effectService.preview({
                                ctx,
                                dto: {
                                    ctx,
                                    source: enemy,
                                    args: {
                                        initialValue: effects[effectIndex].args.value ?? 0,
                                        currentValue: effects[effectIndex].args.value ?? 0,
                                    },
                                },
                                effect: effects[effectIndex].effect,
                            });

                            value += preview.args.currentValue;
                            // TODO: Confirm if multiplier actually works on damage effects (i.e. multi attacks)
                            // value += preview.args.currentValue * (effects[effectIndex].args.multiplier ?? 1);
                        }
                    }
                }
                enemyIntent.intents.push({
                    ...(intent.type === EnemyIntentionType.Attack && { value }),
                    description: this.descriptionGenerator(intent.type, value),
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
