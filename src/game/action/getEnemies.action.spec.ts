import { Enemy, EnemySchema } from '../components/enemy/enemy.schema';
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
import { EffectService } from '../effects/effects.service';
import { CardPlayedAction } from './cardPlayed.action';
import { StatusService } from '../status/status.service';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryService } from '../history/history.service';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { EndPlayerTurnProcess } from '../process/endPlayerTurn.process';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { ProviderService } from '../provider/provider.service';
import {
    CombatQueue,
    CombatQueueSchema,
} from '../components/combatQueue/combatQueue.schema';
import { DefenseEffect } from '../effects/defense/defense.effect';

import { DamageEffect } from '../effects/damage/damage.effect';
import { GetEnergyAction } from './getEnergy.action';
import {
    DebugLogger,
    IntegrationTestServer,
} from 'src/tests/integrationTestServer';
import { CreateCardAction } from './createCard.action';
import { CardService } from '../components/card/card.service';
import { MoveCardAction } from './moveCard.action';
import { data } from '../components/card/card.data';
import {
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { CardServiceMock } from 'src/tests/cardServiceMock';
import { AttackCard } from '../components/card/data/attack.card';
import { AutonomousWeaponCard } from '../components/card/data/autonomousWeapon.card';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetCurrentStepAction } from './getCurrentStep.action';
import { GetEnemiesAction } from './getEnemies.action';
import { sporeMongerData } from '../components/enemy/data/sporeMonger.enemy';
import { EnemySeeder } from '../components/enemy/enemy.seeder';

describe('DiscardCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
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
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        getEnemiesAction = its.getInjectable(GetEnemiesAction);
        const enemySeeder = its.getInjectable(EnemySeeder);
        await enemySeeder.seed();
    });

    it('get card piles action', async () => {
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
                nodeType: ExpeditionMapNodeTypeEnum.Combat,
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
