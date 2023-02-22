import { Enemy, EnemySchema } from '../components/enemy/enemy.schema';
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
import { StatusService } from '../status/status.service';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { GetEnemiesAction } from './getEnemies.action';
import { sporeMongerData } from '../components/enemy/data/sporeMonger.enemy';
import { EnemySeeder } from '../components/enemy/enemy.seeder';

describe('GetEnemiesAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getEnemiesAction: GetEnemiesAction;
    let enemyService: EnemyService;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            providers: [
                {
                    provide: PlayerService,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
                EnemyService,
                ServerSocketGatewayMock,
                ExpeditionService,
                GetEnemiesAction,
                EnemySeeder,
            ],
            models: [
                { name: Enemy.name, schema: EnemySchema },
                { name: Expedition.name, schema: ExpeditionSchema },
            ],
        });

        enemyService = its.getInjectable(EnemyService);
        expeditionService = its.getInjectable(ExpeditionService);
        getEnemiesAction = its.getInjectable(GetEnemiesAction);
        const enemySeeder = its.getInjectable(EnemySeeder);
        await enemySeeder.seed();
    });

    it('get expedition enemies', async () => {
        const [clientSocket] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const sporeMongerEnemy = await enemyService.findById(
            sporeMongerData.enemyId,
        );
        expect(sporeMongerEnemy).toBeDefined();

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
                    enemies: [
                        {
                            id: sporeMongerEnemy.enemyId,
                            defense: 0,
                            hpCurrent: 10,
                            hpMax: 10,
                            currentScript: sporeMongerEnemy.scripts[0],
                            statuses: {
                                buff: [],
                                debuff: [],
                            },
                            ...sporeMongerEnemy,
                        },
                    ],
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

        const resp = await getEnemiesAction.handle(clientId);
        expect(resp).toHaveLength(1);
        const enemyResp = resp[0];
        expect(enemyResp).toMatchObject({
            id: 1,
            enemyId: 1,
            defense: 0,
            name: 'Sporemonger',
            type: 'plant',
            category: 'basic',
            size: 'small',
            hpCurrent: 10,
            hpMax: 10,
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
