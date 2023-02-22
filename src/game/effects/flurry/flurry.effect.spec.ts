import { Test, TestingModule } from '@nestjs/testing';
import { set } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { EffectService } from '../effects.service';
import { FlurryEffect } from './flurry.effect';

describe('FlurryEffect', () => {
    let flurryEffect: FlurryEffect;
    let effectService: EffectService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FlurryEffect,
                {
                    provide: EnemyService,
                    useValue: {},
                },
                {
                    provide: EffectService,
                    useValue: {
                        apply: jest.fn(),
                    },
                },
            ],
        }).compile();

        flurryEffect = module.get<FlurryEffect>(FlurryEffect);
        effectService = module.get<EffectService>(EffectService);
        ctx = {
            expedition: {},
        };
        source = {};
        target = {};
        args = {
            currentValue: 2,
        };
    });

    it('should be defined', () => {
        expect(flurryEffect).toBeDefined();
    });

    it('should apply damage effect based on current energy', async () => {
        set(ctx.expedition, PLAYER_ENERGY_PATH, 2);
        await flurryEffect.handle({ ctx, source, target, args });
        expect(effectService.apply).toBeCalledTimes(2);
    });

    it('should apply damage effect based on current energy', async () => {
        set(ctx.expedition, PLAYER_ENERGY_PATH, 5);
        await flurryEffect.handle({ ctx, source, target, args });
        expect(effectService.apply).toBeCalledTimes(5);
    });
});
