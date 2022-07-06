import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';
import { IBaseStatus, StatusDirection, StatusDTO } from './interfaces';
import { StatusService } from './status.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expedition } from '../components/expedition/expedition.schema';
import { StatusDecorator } from './status.decorator';
import { Statuses } from './contants';

@StatusDecorator({
    effects: [EffectName.Damage],
    status: Statuses.Resolve,
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
    status: Statuses.Fortitude,
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
                    name: Statuses.Resolve.name,
                    args: {
                        value: null,
                    },
                },
            ],
            EffectName.Damage,
            payload,
        );

        expect(result['status']).toBe('A');
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
                    name: Statuses.Fortitude.name,
                    args: {
                        value: null,
                    },
                },
                {
                    name: Statuses.Resolve.name,
                    args: {
                        value: null,
                    },
                },
            ],
            EffectName.Damage,
            payload,
        );

        expect(result['status']).toBe('BA');
    });
});
