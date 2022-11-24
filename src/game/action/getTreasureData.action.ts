import { Injectable } from '@nestjs/common';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { TreasureInterface } from '../treasure/treasure.interfaces';
@Injectable()
export class GetTreasureDataAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<TreasureInterface['size']> {
        const { nodeType, ...currentNode } =
            await this.expeditionService.getCurrentNode({
                clientId,
            });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Treasure) {
            throw new CustomException(
                'This node is not a treasure node',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const {
            treasureData: { size },
        } = currentNode;

        return size;
    }
}
