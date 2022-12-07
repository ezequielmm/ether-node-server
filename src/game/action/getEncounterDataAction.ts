import { Injectable } from '@nestjs/common';
import { EncounterService } from '../components/encounter/encounter.service';

@Injectable()
export class GetEncounterDataAction {
    constructor(private readonly encounterService: EncounterService) {}

    async handle(clientId: string): Promise<string> {
        const encounter = this.encounterService.getByEncounterId(3);
        return encounter;
    }
}
