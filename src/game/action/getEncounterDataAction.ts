import { Injectable } from '@nestjs/common';
import { EncounterService } from '../components/encounter/encounter.service';
import { ExpeditionService } from '../components/expedition/expedition.service';

export interface EncounterDTO {
    displayText: string;
    buttonText: string[];
}
@Injectable()
export class GetEncounterDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly encounterService: EncounterService,
    ) {}

    async handle(clientId: string): Promise<EncounterDTO> {
        const encounter = await this.encounterService.getByEncounterId(3);
        const stageZero = encounter.stages[0];
        const buttonText = stageZero.buttonText;
        const displayText = stageZero.displayText;
        const answer: EncounterDTO = { displayText, buttonText };
        return answer;
    }
}
