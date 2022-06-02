import { ExpeditionService } from '../expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';
import { restoreMap } from '../map/app';
import { GameManagerService } from 'src/game/gameManager/gameManager.service';
import { Activity } from 'src/game/elements/prototypes/activity';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';

@Injectable()
export class NodeSelectedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(client: Socket, node_id: number): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'nodeSelected',
        );

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

            const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
            const combatNodes = nodeTypes.filter(
                (node) => node.search('combat') !== -1,
            );

            let currentNode = {};

            if (combatNodes.includes(node.type)) {
                const cards = await this.expeditionService.getDeckCards(
                    client.id,
                );

                const handCards = cards
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 5);

                const drawCards = this.cardService.removeHandCardsFromDrawPile(
                    cards,
                    handCards,
                );

                currentNode = {
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
                };
            } else {
                currentNode = {
                    node_id,
                    completed: true,
                    node_type: node.type,
                    data: {
                        round: 0,
                        action: 0,
                        player: {
                            cards: {},
                        },
                    },
                };
            }

            const { current_node } = await this.expeditionService.update(
                {
                    client_id: client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                {
                    current_node: currentNode,
                },
            );

            await action.log(
                new Activity('current_node', node_id, 'node-selected', {}, [
                    {
                        mod: 'set',
                        key: 'current_node',
                        val: current_node,
                    },
                ]),
            );

            const response = await action.end();

            return JSON.stringify(response);
        } else {
            throw new CustomException(
                'Selected node is not available',
                ErrorBehavior.None,
            );
        }
    }
}
