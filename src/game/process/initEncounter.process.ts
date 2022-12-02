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
import { InitMerchantProcess } from './initMerchant.process';
import { InitNodeProcess } from './initNode.process';

@Injectable()
export class InitEncounterProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly initTreasureProcess: InitTreasureProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initNodeProcess: InitNodeProcess,
    ) {}

    private client: Socket;
    private node: IExpeditionNode;

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        this.client = client;
        this.node = node;

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createEncounterData();
        }
    }

    private async createEncounterData(): Promise<string> {
        const nodeType = getRandomItemByWeight(
            [
                ExpeditionMapNodeTypeEnum.Encounter,
                ExpeditionMapNodeTypeEnum.Merchant,
                ExpeditionMapNodeTypeEnum.Camp,
                ExpeditionMapNodeTypeEnum.Treasure,
            ],
            //[85, 10, 5],
            [25, 25, 25, 25],
        );

        switch (nodeType) {
            case ExpeditionMapNodeTypeEnum.Encounter:
                return StandardResponse.respond({
                    message_type: SWARMessageType.EncounterUpdate,
                    action: SWARAction.BeginEncounter,
                    data: null,
                });
            case ExpeditionMapNodeTypeEnum.Merchant:
                this.node.type = ExpeditionMapNodeTypeEnum.Merchant;
                return this.initMerchantProcess.process(this.client, this.node);
            case ExpeditionMapNodeTypeEnum.Camp:
                this.node.type = ExpeditionMapNodeTypeEnum.Camp;
                await this.initNodeProcess.process(this.client, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
        }
    }
}
