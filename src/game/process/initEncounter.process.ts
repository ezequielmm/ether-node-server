import { Injectable } from '@nestjs/common';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../components/expedition/expedition.enum';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { getRandomItemByWeight } from '../../utils';
import { InitTreasureProcess } from './initTreasure.process';

@Injectable()
export class InitEncounterProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly initTreasureProcess: InitTreasureProcess,
    ) {}
    private client: Socket;
    private node: IExpeditionNode;
    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        this.client = client;
        this.node = node;

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createEncounterData();
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.continueEncounter();
        }
    }

    private async createEncounterData(): Promise<string> {
        const nodeType = getRandomItemByWeight(
            [
                ExpeditionMapNodeTypeEnum.Encounter,
                ExpeditionMapNodeTypeEnum.Merchant,
                ExpeditionMapNodeTypeEnum.CampRegular,
            ],
            [85, 10, 5],
        );

        return await this.initTreasureProcess.process(this.client, this.node);
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.BeginEncounter,
            data: null,
        });
    }

    private async continueEncounter(): Promise<string> {
        return await this.initTreasureProcess.process(this.client, this.node);
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.ContinueEncounter,
            data: null,
        });
    }
}
