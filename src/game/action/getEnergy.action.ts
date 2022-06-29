import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class GetEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<number[]> {
        const {
            data: {
                player: { energy, energyMax },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        return [energy, energyMax];
    }
}
