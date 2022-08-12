import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyTypeEnum,
} from '../components/enemy/enemy.enum';
import { EnemyService } from '../components/enemy/enemy.service';

interface IEnemiesResponse {
    id: string;
    enemyId: number;
    defense: number;
    name: string;
    type: EnemyTypeEnum;
    category: EnemyCategoryEnum;
    size: EnemySizeEnum;
    hpCurrent: number;
    hpMax: number;
}

@Injectable()
export class GetEnemiesAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(clientId: string): Promise<IEnemiesResponse[]> {
        // First we get the enemies from the current node
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        return enemies.map((enemy) => {
            return {
                id: enemy.id,
                enemyId: enemy.enemyId,
                defense: enemy.defense,
                name: enemy.name,
                type: enemy.type,
                category: enemy.category,
                size: enemy.size,
                hpCurrent: enemy.hpCurrent,
                hpMax: enemy.hpMax,
            };
        });
    }
}
