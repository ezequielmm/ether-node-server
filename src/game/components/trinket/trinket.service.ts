import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'kindagoose';
import { chain, filter as filterFunction, find, sample } from 'lodash';
import { MutateDTO } from 'src/game/effects/effects.interface';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { StatusDirection } from 'src/game/status/interfaces';
import { GameContext } from '../interfaces';
import { PlayerService } from '../player/player.service';
import * as Trinkets from './collection';
import { TrinketModifier } from './trinket-modifier';
import { Trinket } from './trinket.schema';

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
        return filterFunction(this.findAll(), filter);
    }

    public findOne(filter: Partial<Trinket>): Trinket {
        return find(this.findAll(), filter);
    }

    public getRandomTrinket(filter?: Partial<Trinket>): Trinket {
        return sample(this.find(filter));
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
        await trinket.onAttach(ctx);
        await ctx.expedition.save();

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.AddTrinket,
                action: SWARAction.TrinketAdded,
                data: { trinketId },
            }),
        );

        return true;
    }

    public async pipeline(mutateDTO: MutateDTO) {
        const trinkets: TrinketModifier[] = [];

        if (PlayerService.isPlayer(mutateDTO.dto.source)) {
            trinkets.push(
                ...chain(mutateDTO.ctx.expedition.playerState.trinkets)
                    .filter(TrinketModifier.isModifier)
                    .filter({
                        direction: StatusDirection.Outgoing,
                        effect: mutateDTO.effect,
                    })
                    .value(),
            );
        }

        if (PlayerService.isPlayer(mutateDTO.dto.target)) {
            trinkets.push(
                ...chain(mutateDTO.ctx.expedition.playerState.trinkets)
                    .filter(TrinketModifier.isModifier)
                    .filter({
                        direction: StatusDirection.Incoming,
                        effect: mutateDTO.effect,
                    })
                    .value(),
            );
        }

        return chain(trinkets)
            .reduce((dto, trinket) => trinket.mutate(dto), mutateDTO.dto)
            .value();
    }
}
