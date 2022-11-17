import {
    CombatTurnEnum,
    ExpeditionMapNodeStatusEnum,
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
import { GetEnergyAction } from './getEnergy.action';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';

describe('GetEnergyAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getEnergyAction: GetEnergyAction;

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
                GetEnergyAction,
            ],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
        });

        expeditionService = its.getInjectable(ExpeditionService);
        getEnergyAction = its.getInjectable(GetEnergyAction);
    });

    it('get player energy', async () => {
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
                    type: ExpeditionMapNodeTypeEnum.Combat,
                    subType: ExpeditionMapNodeTypeEnum.Camp,
                    status: ExpeditionMapNodeStatusEnum.Active,
                    exits: [],
                    enter: [],
                    private_data: {},
                },
            ],
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
        });

        const expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        const resp = await getEnergyAction.handle(clientId);
        expect(resp).toHaveLength(2);
        expect(resp[0]).toBe(3);
        expect(resp[1]).toBe(4);
    });

    afterAll(async () => {
        await its.stop();
    });
});
