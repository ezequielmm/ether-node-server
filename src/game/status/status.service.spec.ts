import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BaseEffectDTO } from '../effects/dto';
import { EffectName } from '../effects/interfaces/baseEffect';
import { IBaseStatus, StatusName, StatusType } from './interfaces';
import { Status } from './status.decorator';
import { StatusService } from './status.service';

@Status({
    effects: [EffectName.Damage],
    type: StatusType.Buff,
    name: StatusName.Resolve,
})
@Injectable()
class StatusA implements IBaseStatus {
    async handle(payload: BaseEffectDTO): Promise<BaseEffectDTO> {
        payload['status'] = (payload['status'] || '') + 'A';
        return payload;
    }
}

@Status({
    effects: [EffectName.Defense, EffectName.Damage],
    type: StatusType.Debuff,
    name: StatusName.Fortitude,
})
@Injectable()
class StatusB implements IBaseStatus {
    async handle(payload: BaseEffectDTO): Promise<BaseEffectDTO> {
        payload['status'] = (payload['status'] || '') + 'B';
        return payload;
    }
}

describe('StatusService', () => {
    let statusService: StatusService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [StatusService, StatusA, StatusB],
        }).compile();

        statusService = module.get(StatusService);
    });

    it('should be defined', () => {
        expect(statusService).toBeDefined();
    });

    it('should call status handle by effect name', async () => {
        const payload: BaseEffectDTO = {
            client_id: 'test',
        };

        const result = await statusService.process(
            [
                {
                    name: StatusName.Resolve,
                    args: {},
                },
            ],
            EffectName.Damage,
            payload,
        );

        expect(result['status']).toBe('A');
    });

    it('should call status handle by effect name by buff-debuff order', async () => {
        const payload: BaseEffectDTO = {
            client_id: 'test',
        };

        const result = await statusService.process(
            [
                {
                    name: StatusName.Fortitude,
                    args: {},
                },
                {
                    name: StatusName.Resolve,
                    args: {},
                },
            ],
            EffectName.Damage,
            payload,
        );

        expect(result['status']).toBe('AB');
    });
});
