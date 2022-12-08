import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { FilterQuery, Model } from 'mongoose';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameContext } from '../interfaces';
import { Trinket, TrinketDocument } from './trinket.schema';
import { getTrinketField, TrinketId } from './trinket.type';

@Injectable()
export class TrinketService {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async findAll(): Promise<TrinketDocument[]> {
        return this.trinket.find({ isActive: true }).lean();
    }

    async findById(id: TrinketId): Promise<TrinketDocument> {
        const field = getTrinketField(id);
        return this.trinket.findOne({ [field]: id }).lean();
    }

    public async getRandomTrinket(
        filter?: FilterQuery<Trinket>,
    ): Promise<TrinketDocument> {
        const [trinket] = await this.trinket
            .aggregate<TrinketDocument>([
                { $match: filter },
                { $sample: { size: 1 } },
            ])
            .exec();

        return trinket;
    }

    public async add(ctx: GameContext, trinketId: number): Promise<boolean> {
        const trinket = await this.findById(trinketId);

        if (!trinket) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.AddTrinket,
                    action: SWARAction.TrinketNotFoundInDatabase,
                    data: { trinketId },
                }),
            );
            return false;
        }

        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            $push: {
                'playerState.trinkets': {
                    id: randomUUID(),
                    ...trinket,
                },
            },
        });

        return true;
    }
}
