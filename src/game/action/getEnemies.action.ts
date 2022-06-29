import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionCurrentNodeDataEnemy } from '../components/expedition/expedition.interface';

@Injectable()
export class GetEnemiesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<IExpeditionCurrentNodeDataEnemy[]> {
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        return enemies;
    }
}
