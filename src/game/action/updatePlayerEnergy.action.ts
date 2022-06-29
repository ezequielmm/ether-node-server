import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

interface UpdatePlayerEnergyDTO {
    readonly clientId: string;
    readonly newEnergy: number;
}

@Injectable()
export class UpdatePlayerEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: UpdatePlayerEnergyDTO) {
        await this.expeditionService.updatePlayerEnergy(payload);
    }
}
