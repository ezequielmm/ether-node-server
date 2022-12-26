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
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { CreateCardAction } from './createCard.action';
import { CardService } from '../components/card/card.service';
import { MoveCardAction } from './moveCard.action';
import {
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { AttackCard } from '../components/card/data/attack.card';
import { AutonomousWeaponCard } from '../components/card/data/autonomousWeapon.card';
import { DrawCardAction } from './drawCard.action';

describe('DrawCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let drawCardAction: DrawCardAction;
    let cardService: CardService;

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
                MoveCardAction,
                ServerSocketGatewayMock,
                CardService,
                CreateCardAction,
                CardSeeder,
                DrawCardAction,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
                { name: Enemy.name, schema: EnemySchema },
                { name: CombatQueue.name, schema: CombatQueueSchema },
            ],
        });

        cardService = its.getInjectable(CardService);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        drawCardAction = its.getInjectable(DrawCardAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('draw a card from draw pile and discard pile', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const attackCard = await cardService.findById(AttackCard.cardId);
        expect(attackCard).toBeDefined();

        const autonomousWeaponCard = await cardService.findById(
            AutonomousWeaponCard.cardId,
        );
        expect(autonomousWeaponCard).toBeDefined();

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
                            draw: [
                                {
                                    id: attackCard.cardId,
                                    isTemporary: false,
                                    ...attackCard,
                                },
                            ],
                            discard: [
                                {
                                    id: autonomousWeaponCard.cardId,
                                    isTemporary: false,
                                    ...autonomousWeaponCard,
                                },
                            ],
                            exhausted: [],
                        },
                    },
                },
            },
        });

        let expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            1,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(1);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(0);

        await drawCardAction.handle({
            ctx: {
                client: mockedSocketGateway.clientSocket,
                expedition,
            },
            amountToTake: 2,
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(2);

        await clientSocket.waitMessages(messages, 3);
        expect(messages).toHaveLength(3);
        let message = messages[0];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'hand', id: 1, source: 'draw' },
        ]);
        message = messages[1];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'draw', id: 145, source: 'discard' },
        ]);
        message = messages[2];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'hand', id: 145, source: 'draw' },
        ]);
    });

    afterAll(async () => {
        await its.stop();
    });
});
