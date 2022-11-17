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
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { SWARAction } from '../standardResponse/standardResponse';
import { FullSyncAction } from './fullSync.action';

describe('FullSyncAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let fullSyncAction: FullSyncAction;

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
                ServerSocketGatewayMock,
                ExpeditionService,
                FullSyncAction,
            ],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
        });

        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        fullSyncAction = its.getInjectable(FullSyncAction);
    });

    it('get player expedition sync', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        await expeditionService.create({
            clientId: clientId,
            playerId: 0,
            map: [],
            playerState: {
                playerId: '1',
                playerName: 'some_name',
                characterClass: 'some_class',
                hpMax: 1,
                hpCurrent: 1,
                gold: 1,
                potions: [],
                trinkets: [],
                createdAt: new Date(),
                cards: [],
                cardUpgradeCount: 1,
                cardDestroyCount: 1,
            },
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
                            hand: [],
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

        await fullSyncAction.handle(mockedSocketGateway.clientSocket, true);

        await clientSocket.waitMessages(messages, 2);
        expect(messages).toHaveLength(2);
        let message = messages[0];
        expect(message.data.action).toBe(SWARAction.ShowMap);
        expect(message.data.data).toMatchObject([]);

        message = messages[1];
        expect(message.data.action).toBe(SWARAction.UpdatePlayerState);
        expect(message.data.data).toMatchObject({
            playerState: {
                cards: [],
                characterClass: 'some_class',
                gold: 1,
                hpCurrent: 1,
                hpMax: 1,
                id: '1',
                playerId: 0,
                playerName: 'some_name',
                potions: [],
                trinkets: [],
            },
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
