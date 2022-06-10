import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

interface TurnChangeDTO {
    readonly client_id: string;
}

@Injectable()
export class TurnChangeAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: TurnChangeDTO) {
        await this.expeditionService.turnChange(payload);
    }
}
