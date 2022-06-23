import { Injectable } from '@nestjs/common';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

interface TurnChangeDTO {
    readonly client_id: string;
}

@Injectable()
export class TurnChangeAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: TurnChangeDTO): Promise<ExpeditionDocument> {
        return await this.expeditionService.turnChange(payload);
    }
}
