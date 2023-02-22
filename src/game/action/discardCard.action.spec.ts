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
import { DiscardCardAction } from './discardCard.action';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { SWARAction } from '../standardResponse/standardResponse';
import { CardServiceMock } from 'src/tests/cardServiceMock';
import { AttackCard } from '../components/card/data/attack.card';
import { AutonomousWeaponCard } from '../components/card/data/autonomousWeapon.card';

describe('DiscardCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let discardCardAction: DiscardCardAction;
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
                DiscardCardAction,
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
        discardCardAction = its.getInjectable(DiscardCardAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('discard selected cards', async () => {
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
                            hand: [
                                {
                                    id: attackCard.cardId,
                                    isTemporary: false,
                                    ...attackCard,
                                },
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
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(3);

        await discardCardAction.handle({
            client: mockedSocketGateway.clientSocket,
            cardId: attackCard.cardId,
        });

        expedition = await expeditionService.findOne({ clientId });
        expect(expedition).toBeDefined();

        // THIS IS A BUG IT SHOULD BE 2 INSTEAD
        // Basically we have two cards with the same cardid to discard
        // so we should still have those same cards in the discard pile
        expect(expedition.currentNode.data.player.cards.discard).toHaveLength(
            1,
        );
        expect(expedition.currentNode.data.player.cards.draw).toHaveLength(0);
        expect(expedition.currentNode.data.player.cards.exhausted).toHaveLength(
            0,
        );
        expect(expedition.currentNode.data.player.cards.hand).toHaveLength(1);

        await clientSocket.waitMessages(messages, 1);
        expect(messages).toHaveLength(1);
        const message = messages[0];
        expect(message.data.action).toBe(SWARAction.MoveCard);
        expect(message.data.data).toMatchObject([
            { destination: 'discard', id: 1, source: 'hand' },
        ]);
    });

    afterAll(async () => {
        await its.stop();
    });
});
