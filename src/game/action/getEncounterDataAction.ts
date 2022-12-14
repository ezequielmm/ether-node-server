import { Injectable } from '@nestjs/common';
import { EncounterService } from '../components/encounter/encounter.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Socket } from 'socket.io';

export interface EncounterDTO {
    imageId: string;
    displayText: string;
    buttons: {
        text: string;
        enabled: boolean;
    }[];
}
@Injectable()
export class GetEncounterDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly encounterService: EncounterService,
    ) {}

    async handle(client: Socket): Promise<EncounterDTO> {
        return await this.encounterService.getEncounterDTO(client);
    }
}
