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
import { CardPlayedAction } from './cardPlayed.action';
import { StatusService } from '../status/status.service';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CardSeeder } from '../components/card/card.seeder';
import { Card, CardSchema } from '../components/card/card.schema';
import { IntegrationTestServer } from 'src/tests/integrationTestServer';
import { CardService } from '../components/card/card.service';
import { MoveCardAction } from './moveCard.action';
import { StunnedCard } from '../components/card/data/stunned.card';
import { GetUpgradableCardsAction } from './getUpgradableCards.action';

describe('GetUpgradableCardsAction', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionService;
    let getUpgradableCardsAction: GetUpgradableCardsAction;
    let cardService: CardService;

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
                {
                    provide: CardPlayedAction,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
                {
                    provide: MoveCardAction,
                    useValue: {},
                },
                CardService,
                ServerSocketGatewayMock,
                ExpeditionService,
                GetUpgradableCardsAction,
                CardSeeder,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
            ],
        });

        cardService = its.getInjectable(CardService);
        expeditionService = its.getInjectable(ExpeditionService);
        getUpgradableCardsAction = its.getInjectable(GetUpgradableCardsAction);
        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('get upgradable cards', async () => {
        const [clientSocket] = await its.addNewSocketConnection();
        const clientId = clientSocket.socket.id;

        const stunnedCard = await cardService.findById(StunnedCard.cardId);
        expect(stunnedCard).toBeDefined();

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
                cards: [
                    {
                        isUpgraded: false,
                        upgradedCardId: stunnedCard.cardId,
                        id: stunnedCard.cardId,
                        isTemporary: false,
                        ...stunnedCard,
                    },
                ],
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

        const resp = await getUpgradableCardsAction.handle(clientId);
        expect(resp).toHaveLength(1);
        expect(resp[0]).toMatchObject({
            __v: 0,
            cardId: 501,
            cardType: 'status',
            description: '',
            energy: 0,
            id: 501,
            isTemporary: false,
            isUpgraded: false,
            keywords: ['fade', 'unplayable'],
            name: 'Stunned',
            pool: 'knight',
            properties: { effects: [], statuses: [] },
            rarity: 'special',
            showPointer: false,
            upgradedCardId: 501,
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
