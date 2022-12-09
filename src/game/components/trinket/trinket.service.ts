import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, InjectModel } from 'nestjs-typegoose';
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

    createById(id: number): Trinket {
        const TrinketClass = Object.values(Trinkets).find(
            (trinket) => trinket.TrinketId === id,
        );

        if (!TrinketClass) return null;

        console.log('TrinketClass', TrinketClass.name);

        const TrinketModel = this.moduleRef.get<
            ReturnModelType<typeof Trinket>
        >(getModelToken(TrinketClass.name), { strict: false });

        return new TrinketModel();
    }

    public async add(ctx: GameContext, trinketId: number): Promise<boolean> {
        const trinket = this.createById(trinketId);

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
