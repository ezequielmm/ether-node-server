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
import { ExhaustCardAction } from './exhaustCard.action';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { SWARAction } from '../standardResponse/standardResponse';
import { CardServiceMock } from 'src/tests/cardServiceMock';
import { AttackCard } from '../components/card/data/attack.card';
import { AutonomousWeaponCard } from '../components/card/data/autonomousWeapon.card';

describe('ExhaustCardAction', () => {
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
