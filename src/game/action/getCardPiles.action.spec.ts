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
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { GetCardPilesAction } from './getCardPiles.action';

describe('GetCardPilesAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getCardPilesAction: GetCardPilesAction;

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
                GetCardPilesAction,
            ],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
        });

        expeditionService = its.getInjectable(ExpeditionService);
        getCardPilesAction = its.getInjectable(GetCardPilesAction);
    });

    it('get card piles from expedition', async () => {
        const [clientSocket] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

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

        const resp = await getCardPilesAction.handle(clientId);
        expect(resp.hand).toHaveLength(0);
        expect(resp.exhausted).toHaveLength(0);
        expect(resp.draw).toHaveLength(0);
        expect(resp.discard).toHaveLength(0);
    });

    afterAll(async () => {
        await its.stop();
    });
});
