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

describe('DiscardCardAction', () => {
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

    it('exhaust selected card', async () => {
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
