import { DamageArgs } from '../effects/damage.effect';
import { EffectDTO } from '../effects/effects.interface';
import { StatusDTO } from './interfaces';
import { ResolveStatus } from './resolve.status';

describe('ResolveStatus', () => {
    it('should calculate new positive damage', async () => {
        const status = new ResolveStatus();
        const dto: StatusDTO<DamageArgs> = {
            args: {
                value: 2,
            },
            effectDTO: {
                args: {
                    initialValue: 3,
                    currentValue: 3,
                },
            } as EffectDTO<DamageArgs>,
        };
        const result = await status.handle(dto);
        expect(result.args.currentValue).toBe(5);
    });

    it('should calculate new zero damage', async () => {
        const status = new ResolveStatus();
        const dto: StatusDTO<DamageArgs> = {
            args: {
                value: -5,
            },
            effectDTO: {
                args: {
                    initialValue: 3,
                    currentValue: 3,
                },
            } as EffectDTO<DamageArgs>,
        };
        const result = await status.handle(dto);
        expect(result.args.currentValue).toBe(0);
    });
});
