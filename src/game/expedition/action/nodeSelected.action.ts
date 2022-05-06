import { ExpeditionService } from '../expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { ExpeditionStatusEnum } from '../enums';

export class NodeSelectedAction {
    private readonly expeditionService: ExpeditionService;
    private readonly cardService: CardService;

    async handle(client: Socket, node_id: number): Promise<string> {
        const node = await this.expeditionService.getExpeditionMapNode(
            client.id,
            node_id,
        );

        const cards = await this.expeditionService.getDeckCards(client.id);

        const handCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5);

        const drawCards = this.cardService.removeHandCardsFromDrawPile(
            cards,
            handCards,
        );

        const { current_node } = await this.expeditionService.update(
            { client_id: client.id, status: ExpeditionStatusEnum.InProgress },
            {
                current_node: {
                    node_id,
                    completed: false,
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
    }
}
