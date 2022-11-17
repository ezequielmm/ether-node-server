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
import { GetMerchantDataAction } from './getMerchantData.action';
import { TrinketService } from '../components/trinket/trinket.service';
import { PotionService } from '../components/potion/potion.service';
import { StunnedCard } from '../components/card/data/stunned.card';

describe('DiscardCardAction', () => {
    let its: IntegrationTestServer;
    let mockedSocketGateway: ServerSocketGatewayMock;
    let expeditionService: ExpeditionService;
    let getMerchantDataAction: GetMerchantDataAction;
    let cardService: CardService;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            providers: [
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
                    provide: PlayerService,
                    useValue: {},
                },
                {
                    provide: MoveCardAction,
                    useValue: {},
                },
                {
                    provide: MoveCardAction,
                    useValue: {},
                },
                ServerSocketGatewayMock,
                CardSeeder,
                CardService,
                {
                    provide: PotionService,
                    useValue: {},
                },
                {
                    provide: TrinketService,
                    useValue: {},
                },
                ServerSocketGatewayMock,
                ExpeditionService,
                GetMerchantDataAction,
            ],
            models: [
                { name: Expedition.name, schema: ExpeditionSchema },
                { name: Card.name, schema: CardSchema },
                { name: Enemy.name, schema: EnemySchema },
            ],
        });

        cardService = its.getInjectable(CardService);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
        expeditionService = its.getInjectable(ExpeditionService);
        getMerchantDataAction = its.getInjectable(GetMerchantDataAction);

        const cardSeeder = its.getInjectable(CardSeeder);
        await cardSeeder.seed();
    });

    it('get card piles action', async () => {
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
                merchantItems: {
                    potions: [],
                    cards: [],
                    trinkets: [],
                },
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

        const resp = await getMerchantDataAction.handle(clientId);
        expect(resp).toMatchObject({
            cards: [],
            coins: 1,
            destroyCost: 100,
            neutralCards: [],
            playerCards: [
                {
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
                },
            ],
            potions: [],
            shopkeeper: 1,
            speechBubble: 'Hello',
            trinkets: [],
            upgradeCost: 100,
            upgradeableCards: [
                {
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
                },
            ],
            upgradedCards: [
                {
                    cardId: 501,
                    cardType: 'status',
                    description: '',
                    energy: 0,
                    isTemporary: false,
                    isUpgraded: false,
                    keywords: ['fade', 'unplayable'],
                    name: 'Stunned',
                    pool: 'knight',
                    properties: { effects: [], statuses: [] },
                    rarity: 'special',
                    showPointer: false,
                },
            ],
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
