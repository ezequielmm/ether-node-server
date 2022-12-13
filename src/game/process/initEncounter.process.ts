import { Injectable, Logger } from '@nestjs/common';
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
import { EncounterService } from '../components/encounter/encounter.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { EncounterIdEnum } from '../components/encounter/encounter.enum';

@Injectable()
export class InitEncounterProcess {
    private readonly logger: Logger = new Logger(InitEncounterProcess.name);
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly initTreasureProcess: InitTreasureProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initNodeProcess: InitNodeProcess,
        private readonly encounterService: EncounterService,
    ) {}

    private client: Socket;
    private node: IExpeditionNode;

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        this.client = client;
        this.node = node;

        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.node,
                this.client.id,
            );

        await this.expeditionService.update(this.client.id, {
            currentNode,
        });

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createEncounterData();
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.continueEncounter();
        }
    }

    private async executeNode(nodeType: ExpeditionMapNodeTypeEnum) {
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
            case ExpeditionMapNodeTypeEnum.Treasure:
                this.node.type = ExpeditionMapNodeTypeEnum.Treasure;
                return await this.initTreasureProcess.process(
                    this.client,
                    this.node,
                );
        }
    }

    private async createEncounterData(): Promise<string> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId: this.client.id,
        });

        const nodeType = getRandomItemByWeight(
            [
                ExpeditionMapNodeTypeEnum.Encounter,
                ExpeditionMapNodeTypeEnum.Merchant,
                ExpeditionMapNodeTypeEnum.Camp,
            ],
            [85, 10, 5],
        );
        return await this.executeNode(nodeType);
    }

    private async continueEncounter(): Promise<string> {
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.ContinueEncounter,
            data: null,
        });
    }
}
