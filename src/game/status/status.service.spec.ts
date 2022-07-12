import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EffectDTO } from '../effects/effects.interface';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusService } from './status.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expedition } from '../components/expedition/expedition.schema';
import { StatusDecorator } from './status.decorator';
import { resolve } from './resolve.status';
import { fortitude } from './fortitude.status';
import { damageEffect, defenseEffect } from '../effects/constants';

@StatusDecorator({
    effects: [damageEffect],
    status: resolve,
})
@Injectable()
class StatusA implements IBaseStatus {
    async handle(payload: StatusDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'A';
        return payload.effectDTO;
    }
}

@StatusDecorator({
    effects: [defenseEffect, damageEffect],
    status: fortitude,
})
@Injectable()
class StatusB implements IBaseStatus {
    async handle(payload: StatusDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'B';
        return payload.effectDTO;
    }
}

describe('StatusService', () => {
    let statusService: StatusService;
    let effectDTO: EffectDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StatusService,
                StatusA,
                StatusB,
                { provide: getModelToken(Expedition.name), useValue: {} },
            ],
        }).compile();

        statusService = module.get(StatusService);
        effectDTO = {
            args: {
                initialValue: 1,
                currentValue: 1,
            },
        } as EffectDTO;
    });

    it('should be defined', () => {
        expect(statusService).toBeDefined();
    });

    it('should call status handle by effect name', async () => {
        const result = await statusService.process(
            [
                {
                    name: resolve.name,
                    args: {
                        value: null,
                        addedInRound: 1,
                    },
                },
            ],
            damageEffect.name,
            effectDTO,
            2,
        );

        expect(result.args.status).toBe('A');
    });

    it('should avoid to call status handle by effect name at the same turn', async () => {
        const result = await statusService.process(
            [
                {
                    name: resolve.name,
                    args: {
                        value: null,
                        addedInRound: 1,
                    },
                },
            ],
            damageEffect.name,
            effectDTO,
            1,
        );

        expect(result.args.status).toBe(undefined);
    });

    it('should call multiple status handle by effect name', async () => {
        const result = await statusService.process(
            [
                {
                    name: fortitude.name,
                    args: {
                        value: null,
                        addedInRound: 1,
                    },
                },
                {
                    name: resolve.name,
                    args: {
                        value: null,
                        addedInRound: 1,
                    },
                },
            ],
            damageEffect.name,
            effectDTO,
            2,
        );

        expect(result.args.status).toBe('BA');
    });
});
