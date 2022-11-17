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

describe('DiscardCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let exhaustCardAction: ExhaustCardAction;
    let cardService: CardServiceMock;

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
                CardServiceMock,
                ServerSocketGatewayMock,
                ExpeditionService,
                ExhaustCardAction,
                CardSeeder,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
            ],
        });

        cardService = its.getInjectable(CardServiceMock);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        exhaustCardAction = its.getInjectable(ExhaustCardAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('exhaust selected card', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        // Notice that we can exhaust(without the keyword) a card that should not be exhausted
        // this logic should be reviewed then
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
                            hand: [
                                {
                                    id: attackCard.cardId,
                                    isTemporary: false,
                                    ...attackCard,
                                },
                                {
                                    id: autonomousWeaponCard.cardId,
                                    isTemporary: false,
                                    ...autonomousWeaponCard,
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

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(2);

        await exhaustCardAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: attackCard.cardId,
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            1,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'exhaust', id: 1, source: 'hand' },
        ]);
    });

    afterAll(async () => {
        await its.stop();
    });
});
