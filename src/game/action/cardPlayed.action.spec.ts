import {
    MongooseModule,
    getConnectionToken,
    InjectModel,
} from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';

import { Enemy, EnemySchema } from '../components/enemy/enemy.schema';
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
import { EffectService } from '../effects/effects.service';
import { CardPlayedAction } from './cardPlayed.action';
import { StatusService } from '../status/status.service';
import { CardRegistry } from '../history/interfaces';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryService } from '../history/history.service';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { EndPlayerTurnProcess } from '../process/endPlayerTurn.process';
import { InMemoryMongoDB } from 'src/tests/inMemoryMongoDB';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { Connection, Model } from 'mongoose';
import { INestApplication, Injectable } from '@nestjs/common';

import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { ClientSocketMock } from 'src/tests/clientSocketMock';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardDocument, CardSchema } from '../components/card/card.schema';
import { CardId, getCardIdField } from '../components/card/card.type';
import { ProviderService } from '../provider/provider.service';
import {
    CombatQueue,
    CombatQueueSchema,
} from '../components/combatQueue/combatQueue.schema';
import { ArmorUpCard } from '../components/card/data/armorUp.card';
import { StandardResponse, SWARAction } from '../standardResponse/standardResponse';

// We use this mock instead the CardService to avoid using

@Injectable()
class CardServiceMocked {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}
    async findById(id: CardId): Promise<CardDocument> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }
}

describe('CardPlayedAction Action', () => {
    let module: TestingModule;
    let expeditionService: ExpeditionService;
    let cardPlayedAction: CardPlayedAction;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let connection: Connection;
    let app: INestApplication;
    let serverPort: number;
    let clientSockets: Array<ClientSocketMock>;
    let mongod: MongoMemoryServer;
    let cardService: CardServiceMocked;
    let historyService: HistoryService;
    let combatQueueService: CombatQueueService;

    beforeAll(async () => {
        clientSockets = [];

        mongod = await InMemoryMongoDB.buildMongoMemoryServer();
        module = await Test.createTestingModule({
            imports: [
                InMemoryMongoDB.forRootAsyncModule(mongod),
                MongooseModule.forFeature([
                    { name: Enemy.name, schema: EnemySchema },
                    { name: Expedition.name, schema: ExpeditionSchema },
                    { name: Card.name, schema: CardSchema },
                    { name: CombatQueue.name, schema: CombatQueueSchema },
                ]),
            ],
            providers: [
                ProviderService,
                PlayerService,
                StatusService,
                EventEmitter2,
                CombatQueueService,
                HistoryService,
                ExhaustCardAction,
                EnemyService,
                {
                    provide: EffectService,
                    useValue: {
                        applyAll: jest.fn(),
                    },
                },
                {
                    provide: DiscardCardAction,
                    useValue: {},
                },
                {
                    provide: EndPlayerTurnProcess,
                    useValue: {},
                },
                ExpeditionService,
                CardPlayedAction,
                ServerSocketGatewayMock,
                CardSeeder,
                CardServiceMocked,
            ],
        }).compile();
        expeditionService = module.get<ExpeditionService>(ExpeditionService);
        expect(expeditionService).toBeDefined();
        cardPlayedAction = module.get<CardPlayedAction>(CardPlayedAction);
        expect(cardPlayedAction).toBeDefined();
        mockedSocketGateway = module.get<ServerSocketGatewayMock>(
            ServerSocketGatewayMock,
        );
        expect(mockedSocketGateway).toBeDefined();

        historyService = module.get<HistoryService>(HistoryService);
        expect(historyService).toBeDefined();

        combatQueueService = module.get<CombatQueueService>(CombatQueueService);
        expect(combatQueueService).toBeDefined();

        const cardSeeder = module.get<CardSeeder>(CardSeeder);
        expect(CardSeeder).toBeDefined();
        await cardSeeder.seed();

        connection = await module.get(getConnectionToken());
        expect(connection).toBeDefined();

        app = module.createNestApplication();
        app.useWebSocketAdapter(new IoAdapter(app));

        await app.init();
        const { port } = app.getHttpServer().listen().address();
        serverPort = port;

        cardService = module.get<CardServiceMocked>(CardServiceMocked);
    });

    it('card does not exist', async () => {
        const clientSocket = new ClientSocketMock();
        clientSockets.push(clientSocket);
        await clientSocket.connect(serverPort);

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: 'card_does_not_exist',
            selectedEnemyId: '',
        });

        // if not resolving this promise we will get a timeout by jest
        await new Promise<void>((resolve) => {
            clientSocket.on('ErrorMessage', (message) => {
                message = JSON.parse(message);
                expect(message.data).toBeDefined();
                expect(message.data.message_type).toBe('error');
                expect(message.data.action).toBe('invalid_card');
                expect(message.data.data).toBeNull();
                resolve();
            });
        });
    });

    // TODO: The idea is to show you how you can create in-memory mongodb documents
    // but we can think a way to seed the testing database -> e.g. re-using seeds
    it('expedition should exist', async () => {
        await expeditionService.create({
            clientId: 'the_client_id',
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
        });
        const expedition = await expeditionService.findOne({
            clientId: 'the_client_id',
        });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
    });

    it('unplayable card', async () => {
        // TODO: call cardPlayedAction.handle() with a unplayable
    });

    it('play exhaust card', async () => {
        const clientSocket = new ClientSocketMock();
        clientSockets.push(clientSocket);
        await clientSocket.connect(serverPort);

        let putDataMessage;
        clientSocket.on('PutData', (message) => {
            message = JSON.parse(message);
            putDataMessage = message;
        });

        const clientId = clientSocket.socket.id;

        const armorUpCard = await cardService.findById(ArmorUpCard.cardId);
        expect(armorUpCard).toBeDefined();

        await expeditionService.create({
            clientId: clientId,
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
            currentNode: {
                nodeId: 0, // no idea
                nodeType: ExpeditionMapNodeTypeEnum.Combat,
                completed: false,
                showRewards: true,
                data: {
                    round: 0,
                    playing: CombatTurnEnum.Player,
                    rewards: [],
                    // we set no enemies in order to end the match right away
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
                                    id: armorUpCard.cardId,
                                    isTemporary: false,
                                    ...armorUpCard,
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
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);

        // double check that the expedition has the armorUpCard on Hand
        expect(expedition.currentNode).toBeDefined();
        expect(expedition.currentNode.data).toBeDefined();
        expect(expedition.currentNode.data.player).toBeDefined();
        expect(expedition.currentNode.data.player.cards).toBeDefined();
        expect(expedition.currentNode.data.player.cards.hand).toBeDefined();
        expect(expedition.currentNode.data.player.cards.discard.length).toBe(0);
        expect(expedition.currentNode.data.player.cards.draw.length).toBe(0);
        expect(expedition.currentNode.data.player.cards.exhausted.length).toBe(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand.length).toBe(1);
        expect(expedition.currentNode.data.player.cards.hand[0].cardId).toBe(
            armorUpCard.cardId,
        );

        let combatQueue = await combatQueueService.findByClientId(clientId);
        expect(combatQueue).toBeNull();

        let history = historyService.get(clientId);

        expect(history).toBeDefined();
        expect(history.length).toBe(0);

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: armorUpCard.cardId,
            // we run this test without enemies
            selectedEnemyId: '',
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
        expect(expedition.currentNode.data.player.cards.hand.length).toBe(0);
        expect(expedition.currentNode.data.player.cards.exhausted.length).toBe(
            1,
        );
        expect(
            expedition.currentNode.data.player.cards.exhausted[0].cardId,
        ).toBe(armorUpCard.cardId);

        history = historyService.get(clientId);
        expect(history).toBeDefined();
        expect(history.length).toBe(1);
        expect(history[0].type).toBe('card');
        expect((history[0] as CardRegistry).card.id).toBe(armorUpCard.cardId);

        // we started the queue and it has never ended because we finished the game
        combatQueue = await combatQueueService.findByClientId(clientId);
        expect(combatQueue).not.toBeNull();

        expect(putDataMessage).toBeDefined();
        expect(putDataMessage.data).toBeDefined();
        expect(putDataMessage.data.action).toBe(SWARAction.MoveCard);
        expect(putDataMessage.data.data.length).toBe(1);
        expect(putDataMessage.data.data[0].id).toBe(armorUpCard.cardId);
    });

    it('discard card', async () => {
        // TODO: call cardPlayedAction.handle()
    });

    afterAll(async () => {
        clientSockets.forEach((cs) => {
            cs.disconnect();
        });
        await mongod.stop();
        await connection.close();
        await app.close();
    });
});
