import { Injectable } from '@nestjs/common';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionMapNodeStatusEnum } from '../components/expedition/expedition.enum';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class InitEncounterProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createEncounterData();
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.continueEncounter();
        }
    }

    private async createEncounterData(): Promise<string> {
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.BeginEncounter,
            data: null,
        });
    }

    private async continueEncounter(): Promise<string> {
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.ContinueEncounter,
            data: null,
        });
    }
}
