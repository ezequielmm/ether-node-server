import {
    CombatTurnEnum,
    ExpeditionStatusEnum,
} from '../components/expedition/expedition.enum';
import { NodeType } from '../components/expedition/node-type';
import { NodeStatus } from '../components/expedition/node-status';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PlayerService } from '../components/player/player.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { GetTreasureDataAction } from './getTreasureData.action';
import { LargeChest } from '../treasure/treasure.enum';

describe('GetTreasureDataAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getTreasureDataAction: GetTreasureDataAction;

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
                GetTreasureDataAction,
            ],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
        });
        expeditionService = its.getInjectable(ExpeditionService);
        getTreasureDataAction = its.getInjectable(GetTreasureDataAction);
    });

    it('get trasure data', async () => {
        const [clientSocket] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        await expeditionService.create({
            clientId: clientId,
            playerId: 0,
            map: [
                {
                    id: 0,
                    act: 0,
                    step: 0,
                    isActive: true,
                    isDisable: false,
                    isAvailable: true,
                    isComplete: false,
                    type: NodeType.Combat,
                    subType: NodeType.Camp,
                    status: NodeStatus.Active,
                    exits: [],
                    enter: [],
                    private_data: {
                        treasure: {
                            name: LargeChest.name,
                            type: LargeChest.type,
                            trappedType: LargeChest.trappedType,
                        },
                    },
                },
            ],
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
                            hand: [],
                            draw: [],
                            discard: [],
                            exhausted: [],
                        },
                    },
                },
            },
            isCurrentlyPlaying: false,
        });

        const expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        const resp = await getTreasureDataAction.handle(clientId);
        expect(resp).toBe(LargeChest.type);
    });

    afterAll(async () => {
        await its.stop();
    });
});
