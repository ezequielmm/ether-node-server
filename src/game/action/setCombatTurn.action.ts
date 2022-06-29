import { Injectable } from '@nestjs/common';
import { SetCombatTurnDTO } from '../components/expedition/expedition.dto';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class SetCombatTurnAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: SetCombatTurnDTO): Promise<ExpeditionDocument> {
        return await this.expeditionService.setCombatTurn(payload);
    }
}
