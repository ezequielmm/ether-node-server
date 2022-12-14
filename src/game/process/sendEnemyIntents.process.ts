import { Injectable } from '@nestjs/common';
import { EnemyIntentionType } from '../components/enemy/enemy.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';

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
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<EnemyIntentsResponse[]> {
        // First we query all the enemies from the current node
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        // Then, we return the data mapped to the desired response
        return enemies.map(({ id, currentScript: { intentions } }) => {
            return {
                id,
                intents: intentions.map(({ value, type }) => {
                    return {
                        ...(type === EnemyIntentionType.Attack && { value }),
                        description: this.descriptionGenerator(type, value),
                        type,
                    };
                }),
            };
        });
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