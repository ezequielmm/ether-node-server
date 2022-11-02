import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';

import { Enemy, EnemySchema } from '../components/enemy/enemy.schema';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
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
import { InMemoryMongo } from 'src/tests/inmemory.mongo';
import { Connection } from 'mongoose';

describe('CardPlayedAction Action', () => {
    let expeditionService: ExpeditionService;
    let cardPlayedAction: CardPlayedAction;
    let connection: Connection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                InMemoryMongo.forRootAsync(),
                MongooseModule.forFeature([
                    { name: Enemy.name, schema: EnemySchema },
                    { name: Expedition.name, schema: ExpeditionSchema },
                ]),
            ],
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
                    provide: EffectService,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
                {
                    provide: DiscardCardAction,
                    useValue: {},
                },
                {
                    provide: ExhaustCardAction,
                    useValue: {},
                },
                {
                    provide: EndPlayerTurnProcess,
                    useValue: {},
                },
                {
                    provide: CombatQueueService,
                    useValue: {},
                },
                {
                    provide: HistoryService,
                    useValue: {},
                },
                {
                    provide: EventEmitter2,
                    useValue: {},
                },
                ExpeditionService,
                CardPlayedAction,
            ],
        }).compile();

        expeditionService = module.get<ExpeditionService>(ExpeditionService);
        cardPlayedAction = module.get<CardPlayedAction>(CardPlayedAction);
        expect(expeditionService).toBeDefined();
        expect(cardPlayedAction).toBeDefined();

        connection = await module.get(getConnectionToken());
        expect(connection).toBeDefined();
    });

    // TODO: The idea is to show you how you can create in-memory mongodb documents
    // but we can think a way to seed the testing database -> e.g. re-using seeds
    it('expedition should exist', async () => {
        await expeditionService.create({
            clientId: 'the_client_id',
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
        });
        const expedition = await expeditionService.findOne({});
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
    });

    it('card does not exist', async () => {
        // TODO: call cardPlayedAction.handle() with a fake card
    });

    it('unplayable card', async () => {
        // TODO: call cardPlayedAction.handle() with a unplayable
    });

    it('exhaust card', async () => {
        // TODO: call cardPlayedAction.handle() with an exhausted card
    });

    it('discard card', async () => {
        // TODO: call cardPlayedAction.handle()
    });

    afterAll(async () => {
        await connection.close();
    });
});
