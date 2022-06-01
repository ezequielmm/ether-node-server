import { ExpeditionService } from '../expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';
import { restoreMap } from '../map/app';

@Injectable()
export class NodeSelectedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(client: Socket, node_id: number): Promise<string> {
        const node = await this.expeditionService.getExpeditionMapNode(
            client.id,
            node_id,
        );
        if (node.isAvailable) {
            const map = await this.expeditionService.getExpeditionMap(
                client.id,
            );

            const expeditionMap = restoreMap(map);
            const selectedNode = expeditionMap.fullCurrentMap.get(node_id);

            selectedNode.select(expeditionMap);

            await this.expeditionService.update(
                {
                    status: ExpeditionStatusEnum.InProgress,
                    client_id: client.id,
                },
                { map: expeditionMap.getMap },
            );

            const cards = await this.expeditionService.getDeckCards(client.id);

            const handCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5);

            const drawCards = this.cardService.removeHandCardsFromDrawPile(
                cards,
                handCards,
            );

            const { current_node } = await this.expeditionService.update(
                {
                    client_id: client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                {
                    current_node: {
                        node_id,
                        completed: node.isComplete,
                        node_type: node.type,
                        data: {
                            round: 0,
                            action: 0,
                            player: {
                                energy: 3,
                                energy_max: 5,
                                hand_size: 5,
                                cards: {
                                    draw: drawCards,
                                    hand: handCards,
                                },
                            },
                        },
                    },
                },
            );

            return JSON.stringify({ data: current_node });
        } else {
            // TODO throw Error: 'Selected node is not available'
            return JSON.stringify({
                data: {
                    status: 'error',
                    message: `selected node: ${node_id} is not available`,
                },
            });
        }
    }
}
