import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nestjs-typegoose';
import { FilterQuery, Model } from 'mongoose';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GameContext } from '../interfaces';
import * as Trinkets from './collection';
import { Trinket } from './trinket.schema';
import * as _ from 'lodash';

@Injectable()
export class TrinketService {
    constructor(private readonly moduleRef: ModuleRef) {}

    private createFromClass(TrinketClass: typeof Trinket): Trinket {
        const TrinketModel = this.moduleRef.get<
            ReturnModelType<typeof Trinket>
        >(getModelToken(TrinketClass.name), { strict: false });

        return new TrinketModel();
    }

    public findAll(): Trinket[] {
        return Object.values(Trinkets).map((TrinketClass) =>
            this.createFromClass(TrinketClass),
        );
    }

    public find(filter: Partial<Trinket>): Trinket[] {
        return _.filter(this.findAll(), filter);
    }

    public findOne(filter: Partial<Trinket>): Trinket {
        return _.find(this.findAll(), filter);
    }

    public getRandomTrinket(filter?: Partial<Trinket>): Trinket {
        return _.sample(this.find(filter));
    }

    public async add(ctx: GameContext, trinketId: number): Promise<boolean> {
        const trinket = this.findOne({ trinketId });

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

        ctx.expedition.playerState.trinkets.push(trinket);
        trinket.onAttach(ctx);
        await ctx.expedition.save();

        return true;
    }
}
