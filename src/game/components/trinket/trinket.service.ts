import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'kindagoose';
import {
    chain,
    filter as filterFunction,
    find,
    last,
    sample,
    sampleSize,
    includes,
    toNumber,
} from 'lodash';
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

type TrinketFilter = Partial<Trinket> | ((trinket: Trinket) => boolean);

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

    public find(filter: TrinketFilter): Trinket[] {
        return filterFunction(this.findAll(), filter);
    }

    public findOne(filter: TrinketFilter): Trinket {
        return find(this.findAll(), filter);
    }

    public getRandomTrinket(filter?: TrinketFilter): Trinket {
        return sample(this.find(filter));
    }

    public getRandomTrinkets(
        amount: number,
        filter?: TrinketFilter,
    ): Trinket[] {
        return sampleSize(this.find(filter), amount);
    }

    public async playerHasTrinket(
        ctx: GameContext,
        trinket: number | Trinket,
    ): Promise<boolean> {
        if (typeof trinket === 'number') {
            trinket = this.findOne({ trinketId: trinket });
        }

        return includes(ctx.expedition.playerState.trinkets, trinket);
    }

    public async add({
        ctx,
        trinketId,
        trinketConflicts,
    }: {
        ctx: GameContext;
        trinketId: number;
        trinketReplaces?: number[];
        trinketConflicts?: number[];
    }): Promise<boolean> {
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

        let playerHasTrinket = await this.playerHasTrinket(ctx, trinket);

        if (trinketConflicts) {
            for (const tcId in trinketConflicts) {
                if (await this.playerHasTrinket(ctx, toNumber(tcId))) {
                    playerHasTrinket = true;
                    break;
                }
            }
        }

        if (playerHasTrinket) {
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.AddTrinket,
                    action: SWARAction.TrinketAlreadyOwned,
                    data: { trinket: trinket.trinketId },
                }),
            );
            return false;
        }

        ctx.expedition.playerState.trinkets.push(trinket);
        await last(ctx.expedition.playerState.trinkets).onAttach(ctx);
        ctx.expedition.markModified('playerState.trinkets');
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
