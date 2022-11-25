import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpeditionDTO } from 'src/game/components/expedition/expedition.dto';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import {
    Expedition,
    ExpeditionDocument,
    ExpeditionSchema,
} from 'src/game/components/expedition/expedition.schema';
import { DebugLogger, IntegrationTestServer } from './integrationTestServer';

// We use this simple card mock instead the ExpeditionServiceMock to avoid using
// initializing all expedition dependencies, and be able to use the ExpeditionDocument Model
@Injectable()
class ExpeditionServiceMock {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}
    async findOne(clientId: string): Promise<ExpeditionDocument> {
        return this.expedition.findOne({ clientId }).lean();
    }
    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }
}

describe('IntegrationTestServer', () => {
    let its: IntegrationTestServer;
    let expeditionService: ExpeditionServiceMock;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            providers: [ExpeditionServiceMock],
            models: [{ name: Expedition.name, schema: ExpeditionSchema }],
            logger: DebugLogger,
        });
        expeditionService = its.getInjectable(ExpeditionServiceMock);
    });

    it('expedition should exist in memory MongoDB', async () => {
        await expeditionService.create({
            clientId: 'the_client_id',
            playerId: 0,
            map: [],
            playerState: undefined,
            status: ExpeditionStatusEnum.InProgress,
        });
        const expedition = await expeditionService.findOne('the_client_id');
        expect(expedition).toBeDefined();
        expect(expedition.status).toBe(ExpeditionStatusEnum.InProgress);
    });

    afterAll(async () => {
        await its.stop();
    });
});
