import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusService } from './status.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expedition } from '../components/expedition/expedition.schema';
import { StatusDecorator } from './status.decorator';
import { resolve } from './resolve.status';
import { fortitude } from './fortitude.status';

@StatusDecorator({
    effects: [EffectName.Damage],
    status: resolve,
})
@Injectable()
class StatusA implements IBaseStatus {
    async handle(payload: StatusDTO): Promise<BaseEffectDTO> {
        payload.baseEffectDTO['status'] =
            (payload.baseEffectDTO['status'] || '') + 'A';
        return payload.baseEffectDTO;
    }
}

@StatusDecorator({
    effects: [EffectName.Defense, EffectName.Damage],
    status: fortitude,
})
@Injectable()
class StatusB implements IBaseStatus {
    async handle(payload: StatusDTO): Promise<BaseEffectDTO> {
        payload.baseEffectDTO['status'] =
            (payload.baseEffectDTO['status'] || '') + 'B';
        return payload.baseEffectDTO;
    }
}

describe('StatusService', () => {
    let statusService: StatusService;

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
    });

    it('should be defined', () => {
        expect(statusService).toBeDefined();
    });

    it('should call status handle by effect name', async () => {
        const payload: BaseEffectDTO = {
            client: { id: 'test' } as Socket,
            targetId: 'test',
            targeted: CardTargetedEnum.Player,
            times: 1,
            calculatedValue: 1,
        };

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
            EffectName.Damage,
            payload,
            2,
        );

        expect(result['status']).toBe('A');
    });

    it('should avoid to call status handle by effect name at the same turn', async () => {
        const payload: BaseEffectDTO = {
            client: { id: 'test' } as Socket,
            targetId: 'test',
            targeted: CardTargetedEnum.Player,
            times: 1,
            calculatedValue: 1,
        };

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
            EffectName.Damage,
            payload,
            1,
        );

        expect(result['status']).toBe(undefined);
    });

    it('should call multiple status handle by effect name', async () => {
        const payload: BaseEffectDTO = {
            client: { id: 'test' } as Socket,
            targetId: 'test',
            targeted: CardTargetedEnum.Player,
            times: 1,
            calculatedValue: 1,
        };

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
            EffectName.Damage,
            payload,
            2,
        );

        expect(result['status']).toBe('BA');
    });
});
