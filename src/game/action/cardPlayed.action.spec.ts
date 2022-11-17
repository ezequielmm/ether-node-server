import { InjectModel } from '@nestjs/mongoose';
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
import { CardRegistry, EffectRegistry } from '../history/interfaces';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryService } from '../history/history.service';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { EndPlayerTurnProcess } from '../process/endPlayerTurn.process';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardDocument, CardSchema } from '../components/card/card.schema';
import { CardId, getCardIdField } from '../components/card/card.type';
import { ProviderService } from '../provider/provider.service';
import {
    CombatQueue,
    CombatQueueSchema,
} from '../components/combatQueue/combatQueue.schema';
import { ArmorUpCard } from '../components/card/data/armorUp.card';
import {
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { StunnedCard } from '../components/card/data/stunned.card';
import { AttackCard } from '../components/card/data/attack.card';
import { EnemySeeder } from '../components/enemy/enemy.seeder';
import { sporeMongerData } from '../components/enemy/data/sporeMonger.enemy';
import { DefenseEffect } from '../effects/defense/defense.effect';
import { CardTargetedEnum } from '../components/card/card.enum';
import { DamageEffect } from '../effects/damage/damage.effect';
import { GetEnergyAction } from './getEnergy.action';
import { DebugLogger, IntegrationTestServer } from 'src/tests/integrationTestServer';
import { CardServiceMock } from 'src/tests/cardServiceMock';

describe('CardPlayedAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let cardPlayedAction: CardPlayedAction;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let cardService: CardServiceMock;
    let historyService: HistoryService;
    let combatQueueService: CombatQueueService;
    let enemyService: EnemyService;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
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
                ServerSocketGatewayMock,
                CardSeeder,
                EnemySeeder,
                CardServiceMock,
            ],
            models: [
                { name: Enemy.name, schema: EnemySchema },
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
                { name: CombatQueue.name, schema: CombatQueueSchema },
            ],
            // uncomment if you want to see all logger logs
            // logger: DebugLogger,
        });

        expeditionService = its.getInjectable(ExpeditionService);
        cardPlayedAction = its.getInjectable(CardPlayedAction);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        historyService = its.getInjectable(HistoryService);
        combatQueueService = its.getInjectable(CombatQueueService);
        enemyService = its.getInjectable(EnemyService);
        cardService = its.getInjectable(CardServiceMock);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
        const enemySeeder = its.getInjectable(EnemySeeder);
        await enemySeeder.seed();
    });

    it('card does not exist', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: 'card_does_not_exist',
            selectedEnemyId: '',
        });

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message.data).toBeDefined();
        expect(message.data.message_type).toBe('error');
        expect(message.data.action).toBe('invalid_card');
        expect(message.data.data).toBeNull();
    });

    it('play an unplayable card', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();

        const clientId = clientSocket.socket.id;

        const stunnedCard = await cardService.findById(StunnedCard.cardId);
        expect(stunnedCard).toBeDefined();

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
                    // we set no enemies in order to end the game right away
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
                                    id: stunnedCard.cardId,
                                    isTemporary: false,
                                    ...stunnedCard,
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

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: stunnedCard.cardId,
            selectedEnemyId: '',
        });

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);

        const message = messages[0];
        expect(message).toBeDefined();
        expect(message.data).toBeDefined();
        expect(message.data.message_type).toBe('error');
        expect(message.data.action).toBe('insufficient_energy');
        expect(message.data.data).toBe('This card is unplayable');
    });

    it('play exhaust card', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const armorUpCard = await cardService.findById(ArmorUpCard.cardId);
        expect(armorUpCard).toBeDefined();

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
                    // we set no enemies in order to end the game right away
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
                                    id: armorUpCard.cardId,
                                    isTemporary: false,
                                    ...armorUpCard,
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

        let expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);

        // double check that the expedition has the armorUpCard on Hand
        expect(expedition.currentNode).toBeDefined();
        expect(expedition.currentNode?.data?.player?.cards?.hand).toBeDefined();
        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);
        expect(expedition.currentNode.data.player.cards.hand[0].cardId).toBe(
            armorUpCard.cardId,
        );

        let combatQueue = await combatQueueService.findByClientId(clientId);
        expect(combatQueue).toBeNull();

        let history = historyService.get(clientId);

        expect(history).toBeDefined();
        expect(history).toHaveLength(0);

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: armorUpCard.cardId,
            // we run this test without enemies
            selectedEnemyId: '',
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            1,
        );
        expect(
            expedition.currentNode.data.player.cards.exhausted[0].cardId,
        ).toBe(armorUpCard.cardId);

        history = historyService.get(clientId);
        expect(history).toBeDefined();
        expect(history).toHaveLength(2);

        expect(history[0].type).toBe('card');
        expect((history[0] as CardRegistry).card.id).toBe(armorUpCard.cardId);

        expect(history[1].type).toBe('effect');
        expect((history[1] as EffectRegistry).effect.effect).toBe('defense');
        expect((history[1] as EffectRegistry).effect.target).toBe(
            CardTargetedEnum.Player,
        );

        // we started the queue and it has never ended because we finished the game
        combatQueue = await combatQueueService.findByClientId(clientId);
        expect(combatQueue).not.toBeNull();

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message).toBeDefined();
        expect(message.data).toBeDefined();
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toHaveLength(1);
        expect(message.data.data[0].id).toBe(armorUpCard.cardId);
    });

    it('play to discard a card', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const attackCard = await cardService.findById(AttackCard.cardId);
        expect(attackCard).toBeDefined();

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
                    // we set no enemies in order to end the game right away
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
                        energyMax: 3,
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
                                    id: attackCard.cardId,
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

        let expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);

        expect(expedition.currentNode.data.player.energy).toBe(3);

        expect(expedition.currentNode.data.enemies[0].hpCurrent).toBe(10);

        await cardPlayedAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: attackCard.cardId,
            selectedEnemyId: sporeMongerEnemy.enemyId,
        });

        expedition = await expeditionService.findOne({ clientId });

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            1,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(0);

        expect(expedition.currentNode.data.enemies[0].hpCurrent).toBe(5);

        expect(expedition.currentNode.data.player.energy).toBe(2);

        await clientSocket.waitMessages(messages, 3);
        expect(messages).toHaveLength(3);
        const messageExpectedCases = [
            {
                expectedMessageType: SWARMessageType.PlayerAffected,
                expectedAction: SWARAction.MoveCard,
                expectedData: [
                    { source: 'hand', destination: 'discard', id: 1 },
                ],
            },
            {
                expectedMessageType: SWARMessageType.PlayerAffected,
                expectedAction: SWARAction.UpdateEnergy,
                expectedData: [2, 3],
            },
            {
                expectedMessageType: SWARMessageType.CombatUpdate,
                expectedAction: SWARAction.CombatQueue,
                expectedData: [
                    {
                        originId: 0,
                        originType: 'player',
                        targets: [
                            {
                                defenseDelta: 0,
                                effectType: 'damage',
                                finalDefense: 0,
                                finalHealth: 5,
                                healthDelta: -5,
                                statuses: [],
                                targetId: 1,
                                targetType: 'enemy',
                            },
                        ],
                    },
                ],
            },
        ];

        messageExpectedCases.forEach((mc, i) => {
            const message = messages[i];
            expect(message.data).toBeDefined();
            expect(message.data.message_type).toBe(mc.expectedMessageType);
            expect(message.data.action).toBe(mc.expectedAction);
            expect(message.data.data).toMatchObject(mc.expectedData);
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
