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
import { GetCurrentStepAction } from './getCurrentStep.action';

describe('DiscardCardAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getCurrentStepAction: GetCurrentStepAction;

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
                GetCurrentStepAction,
            ],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
        });

        expeditionService = its.getInjectable(ExpeditionService);
        getCurrentStepAction = its.getInjectable(GetCurrentStepAction);
    });

    it('get current step from current node', async () => {
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
                    private_data: {},
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

        const resp = await getCurrentStepAction.handle(clientId);
        expect(resp.act).toBe(0);
        expect(resp.step).toBe(0);
    });

    afterAll(async () => {
        await its.stop();
    });
});
