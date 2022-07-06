import { DamageDTO } from '../effects/effects.interface';
import { StatusDTO } from './interfaces';
import { ResolveStatus } from './resolve.status';

describe('ResolveStatus', () => {
    it('should calculate new positive damage', async () => {
        const status = new ResolveStatus();
        const dto = {
            args: {
                value: 2,
            },
            baseEffectDTO: {
                calculatedValue: 3,
            },
        } as StatusDTO<DamageDTO>;
        const result = await status.handle(dto);
        expect(result.calculatedValue).toBe(5);
    });

    it('should calculate new zero damage', async () => {
        const status = new ResolveStatus();
        const dto = {
            args: {
                value: -5,
            },
            baseEffectDTO: {
                calculatedValue: 3,
            },
        } as StatusDTO<DamageDTO>;
        const result = await status.handle(dto);
        expect(result.calculatedValue).toBe(0);
    });
});
