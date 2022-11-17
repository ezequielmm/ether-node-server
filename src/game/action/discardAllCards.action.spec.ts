import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
    ExpeditionStatusEnum,
} from '../components/expedition/expedition.enum';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PlayerService } from '../components/player/player.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { SWARAction } from '../standardResponse/standardResponse';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { CardServiceMock } from 'src/tests/cardServiceMock';
import { AttackCard } from '../components/card/data/attack.card';

describe('DiscardAllCardsAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let discardAllCardsAction: DiscardAllCardsAction;
    let cardService: CardServiceMock;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            providers: [
                {
                    provide: PlayerService,
                    useValue: {},
                },
                {
                    provide: EnemyService,
                    useValue: {},
                },
                CardServiceMock,
                ServerSocketGatewayMock,
                ExpeditionService,
                DiscardAllCardsAction,
                CardSeeder,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
            ],
        });

        cardService = its.getInjectable(CardServiceMock);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        discardAllCardsAction = its.getInjectable(DiscardAllCardsAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('put two cards on hand and discard all', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const attackCard = await cardService.findById(AttackCard.cardId);
        expect(attackCard).toBeDefined();

        await expeditionService.create({
            clientId: clientId,
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
            currentNode: {
                nodeId: 0,
                nodeType: ExpeditionMapNodeTypeEnum.Combat,
                completed: false,
                showRewards: true,
                data: {
                    round: 0,
                    playing: CombatTurnEnum.Player,
                    rewards: [],
                    enemies: [],
                    player: {
                        energy: 3,
                        handSize: 1,
                        defense: 1,
                        hpCurrent: 10,
                        hpMax: 10,
                        statuses: {
                            buff: [],
                            debuff: [],
                        },
                        cards: {
                            hand: [
                                {
                                    id: attackCard.cardId,
                                    isTemporary: false,
                                    ...attackCard,
                                },
                                {
                                    id: attackCard.cardId,
                                    isTemporary: false,
                                    ...attackCard,
                                },
                            ],
                            draw: [],
                            discard: [],
                            exhausted: [],
                        },
                    },
                },
            },
        });

        let expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(2);

        await discardAllCardsAction.handle({
            client: mockedSocketGateway.clientSocket,
            // ?????? we do not have en specific message to get back
            SWARMessageTypeToSend: undefined,
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            2,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(0);

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'discard', id: 1, source: 'hand' },
            { destination: 'discard', id: 1, source: 'hand' },
        ]);
    });

    afterAll(async () => {
        await its.stop();
    });
});
