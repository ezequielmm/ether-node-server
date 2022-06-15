import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Effect } from './decorators/effect.decorator';
import { EffectService } from './effect.service';
import { IBaseEffect, JsonEffect } from './interfaces/baseEffect';

@Effect('effectA')
@Injectable()
class EffectA implements IBaseEffect {
    public payload: any;
    async handle(payload: any): Promise<void> {
        this.payload = payload;
    }
}

@Effect('effectB')
@Injectable()
class EffectB implements IBaseEffect {
    public payload: any;
    async handle(payload: any): Promise<void> {
        this.payload = payload;
    }
}

describe('EffectService', () => {
    let service: EffectService;
    let effectA: EffectA;
    let effectB: EffectB;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [EffectA, EffectB, EffectService],
        }).compile();

        service = module.get(EffectService);
        effectA = module.get(EffectA);
        effectB = module.get(EffectB);

        jest.resetModules();
        jest.doMock('./effect.module', () => {
            return {
                EffectModule: jest.fn(() => module),
            };
        });
    });

    it('Should call effect handle by name', async () => {
        const client_id = 'test';
        const effects: JsonEffect[] = [
            {
                name: 'effectA',
                args: {
                    value: 'testA',
                },
            },
            {
                name: 'effectB',
                args: {
                    value: 'testB',
                },
            },
        ];

        await service.process('test', effects);

        expect(effectA.payload).toEqual({
            ...effects[0].args,
            client_id,
        });

        expect(effectB.payload).toEqual({
            ...effects[1].args,
            client_id,
        });
    });
});
