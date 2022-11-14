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
import { CardService } from '../components/card/card.service';
import { Card, CardDocument, CardSchema } from '../components/card/card.schema';
import { CardId, getCardIdField } from '../components/card/card.type';

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
                ]),
            ],
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
                    provide: EffectService,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
                {
                    provide: DiscardCardAction,
                    useValue: {},
                },
                {
                    provide: ExhaustCardAction,
                    useValue: {},
                },
                {
                    provide: EndPlayerTurnProcess,
                    useValue: {},
                },
                {
                    provide: CombatQueueService,
                    useValue: {},
                },
                {
                    provide: HistoryService,
                    useValue: {},
                },
                {
                    provide: EventEmitter2,
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

    it.skip('card does not exist', async () => {
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
    it.skip('expedition should exist', async () => {
        await expeditionService.create({
            clientId: 'the_client_id',
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
        });
        const expedition = await expeditionService.findOne({});
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
    });

    it.skip('unplayable card', async () => {
        // TODO: call cardPlayedAction.handle() with a unplayable
    });

    it('exhaust card', async () => {
        const clientSocket = new ClientSocketMock();
        clientSockets.push(clientSocket);
        await clientSocket.connect(serverPort);

        const clientId = clientSocket.socket.id;

        const attackCard = await cardService.findById(1);
        console.log(attackCard);

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
                                    id: attackCard.id,
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
        const expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);

        /*
        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: 1, // then we solve this inserting attack card
            selectedEnemyId: '',
        });
        */
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
