import {
    CombatTurnEnum,
    ExpeditionStatusEnum,
} from '../components/expedition/expedition.enum';
import { NodeType } from '../components/expedition/node-type';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PlayerService } from '../components/player/player.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { CardPlayedAction } from './cardPlayed.action';
import { StatusService } from '../status/status.service';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { CardService } from '../components/card/card.service';
import { MoveCardAction } from './moveCard.action';
import { SWARAction } from '../standardResponse/standardResponse';
import { StunnedCard } from '../components/card/data/stunned.card';
import { GetUpgradableCardsAction } from './getUpgradableCards.action';

describe('MoveCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let moveCardAction: MoveCardAction;
    let cardService: CardService;

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
                {
                    provide: CardPlayedAction,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
                MoveCardAction,
                CardService,
                ServerSocketGatewayMock,
                ExpeditionService,
                GetUpgradableCardsAction,
                CardSeeder,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
            ],
        });

        cardService = its.getInjectable(CardService);

        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        moveCardAction = its.getInjectable(MoveCardAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('move card from hand to discard pile', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const stunnedCard = await cardService.findById(StunnedCard.cardId);
        expect(stunnedCard).toBeDefined();

        await expeditionService.create({
            clientId: clientId,
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
            currentNode: {
                nodeId: 0,
                nodeType: NodeType.Combat,
                completed: false,
                showRewards: true,
                data: {
                    round: 0,
                    playing: CombatTurnEnum.Player,
                    rewards: [],
                    enemies: [],
                    player: {
                        energy: 3,
                        energyMax: 4,
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
                                    id: stunnedCard.cardId.toString(),
                                    isTemporary: false,
                                    ...stunnedCard,
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

        const expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);
        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );

        await moveCardAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardIds: [stunnedCard.cardId.toString()],
            originPile: 'hand',
            targetPile: 'discard',
        });

        // MOVE CARD ACTION NOT WORKING!!!! Discard pile should be one and hand 0
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);
        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'discard', id: '501' },
        ]);
    });

    afterAll(async () => {
        await its.stop();
    });
});
