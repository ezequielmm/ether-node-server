import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyTypeEnum,
} from '../components/enemy/enemy.enum';

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
        private readonly expeditionService: ExpeditionService
    ) {}

    async handle(clientId: string): Promise<IEnemiesResponse[]> {
        
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        // console.warn("ESTE ES EL CLIENTID: " + clientId + " Y ESTE ES EL CURRENTNODE: " + currentNode);


        // First we get the enemies from the current node
        // const {
        //     data: { enemies },
        // } = currentNode;

        const enemies = currentNode.data.enemies;

        // console.warn("Y ESTOS SON LOS ENEMIES: " + currentNode.data);

        // Now we return the enemies that have their hpCurrent > 0
        return enemies
            .filter(({ hpCurrent }) => {
                return hpCurrent > 0;
            })
            .map((enemy) => ({
                id: enemy.id,
                enemyId: enemy.enemyId,
                defense: enemy.defense,
                name: enemy.name,
                type: enemy.type,
                category: enemy.category,
                size: enemy.size,
                hpCurrent: enemy.hpCurrent,
                hpMax: enemy.hpMax,
            }));
    }
}
