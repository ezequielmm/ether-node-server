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

describe('CreateCardAction', () => {
    let its: IntegrationTestServer;
    let createCardAction: CreateCardAction;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            // sadly we have highly coupled providers
            // so we need to initialize almost all in order to consume
            // a service, like the expedition one
            providers: [
                ProviderService,
                PlayerService,
                StatusService,
                EventEmitter2,
                CombatQueueService,
                HistoryService,
                ExhaustCardAction,
                EnemyService,
                DiscardCardAction,
                DefenseEffect,
                GetEnergyAction,
                DamageEffect,
                EffectService,
                {
                    provide: EndPlayerTurnProcess,
                    useValue: {},
                },
                ExpeditionService,
                CardPlayedAction,
                MoveCardAction,
                ServerSocketGatewayMock,
                CardService,
                CreateCardAction,
                CardSeeder,
            ],
            models: [
                { name: Enemy.name, schema: EnemySchema },
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
                { name: CombatQueue.name, schema: CombatQueueSchema },
            ],
        });

        createCardAction = its.getInjectable(CreateCardAction);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('assign all current cards in player hand', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const cardsIds: number[] = data.map((c) => c.cardId);

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

        let expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode?.data?.player?.cards?.hand).toBeDefined();
        expect(expedition.currentNode?.data?.player?.cards?.hand).toHaveLength(
            0,
        );

        await createCardAction.handle({
            cardsToAdd: cardsIds,
            client: mockedSocketGateway.clientSocket,
            destination: 'hand',
            sendSWARResponse: true,
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode?.data?.player?.cards?.hand).toHaveLength(
            cardsIds.length,
        );

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);

        const message = messages[0];
        expect(message).toBeDefined();
        expect(message.data?.message_type).toBe(SWARMessageType.PlayerAffected);
        expect(message.data?.action).toBe(SWARAction.MoveCard);
    });

    afterAll(async () => {
        await its.stop();
    });
});
