import { Injectable, Logger } from '@nestjs/common';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { ExpeditionService } from '../components/expedition/expedition.service';
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
import { GameContext } from '../components/interfaces';

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

    private ctx: GameContext;
    private node: IExpeditionNode;

    async process(ctx: GameContext, node: IExpeditionNode): Promise<string> {
        this.ctx = ctx;
        this.node = node;

        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                this.node,
            );

        await this.expeditionService.update(this.ctx.client.id, {
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
                return this.initMerchantProcess.process(this.ctx, this.node);
            case ExpeditionMapNodeTypeEnum.Camp:
                this.node.type = ExpeditionMapNodeTypeEnum.Camp;
                await this.initNodeProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case ExpeditionMapNodeTypeEnum.Treasure:
                this.node.type = ExpeditionMapNodeTypeEnum.Treasure;
                return await this.initTreasureProcess.process(
                    this.ctx,
                    this.node,
                );
        }
    }

    private async createEncounterData(): Promise<string> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId: this.ctx.client.id,
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
