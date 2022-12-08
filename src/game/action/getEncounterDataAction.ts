import { Injectable } from '@nestjs/common';
import { EncounterService } from '../components/encounter/encounter.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Socket } from 'socket.io';

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

    async handle(client: Socket): Promise<EncounterDTO> {
        const encounterData = await this.encounterService.getEncounterData(
            client,
        );
        const encounter = await this.encounterService.getByEncounterId(
            encounterData.encounterId,
        );
        const stage = encounter.stages[encounterData.stage];
        const buttonText: string[] = [];
        for (let i = 0; i < stage.buttons.length; i++) {
            buttonText.push(stage.buttons[i].text);
        }
        const displayText = stage.displayText;
        const answer: EncounterDTO = { displayText, buttonText };
        return answer;
    }
}
