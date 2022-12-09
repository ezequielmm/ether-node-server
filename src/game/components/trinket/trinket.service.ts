import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nestjs-typegoose';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GameContext } from '../interfaces';
import * as Trinkets from './collection';
import { Trinket } from './trinket.schema';

@Injectable()
export class TrinketService {
    constructor(private readonly moduleRef: ModuleRef) {}

    findById(id: number): Trinket {
        const TrinketClass = Object.values(Trinkets).find(
            (trinket) => trinket.TrinketId === id,
        );

        if (!TrinketClass) return null;

        const TrinketModel = this.moduleRef.get<
            ReturnModelType<typeof Trinket>
        >(getModelToken(TrinketClass.name));

        return new TrinketModel();
    }

    public async add(ctx: GameContext, trinketId: number): Promise<boolean> {
        const trinket = this.findById(trinketId);

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
        await ctx.expedition.save();

        return true;
    }
}
