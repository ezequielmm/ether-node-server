import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import { MerchantService } from '../merchant/merchant.service';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitMerchantProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly merchantService: MerchantService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                node,
                client.id,
            );

        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);

        const potionItems = await this.merchantService.getPotions();

        const cardItems = await this.merchantService.getCard();

        const trinketItems = await this.merchantService.getTrinket();

        await this.expeditionService.update(client.id, {
            currentNode: {
                ...currentNode,
                merchantItems: {
                    potions: potionItems,
                    cards: cardItems,
                    trinkets: trinketItems,
                },
            },

            map: expeditionMap.getMap,
        });
    }
}
