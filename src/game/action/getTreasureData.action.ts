import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
@Injectable()
export class GetTreasureDataAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        const { nodeType, ...currentNode } =
            await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Treasure) {
            throw new CustomException(
                'This node is not a treasure node',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const {
            treasureData: { size, isOpen, type, rewards },
        } = currentNode;

        if (isOpen) {
            client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.GenericData,
                    action: SWARAction.ChestResult,
                    data: {
                        type: type,
                        rewards: rewards,
                    },
                }),
            );
        }

        return size;
    }
}
