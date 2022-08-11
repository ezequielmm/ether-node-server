import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { Context } from 'src/game/components/interfaces';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectDTO } from '../interfaces';
import { resolve } from './constants';
import { ResolveStatus } from './resolve.status';

describe('ResolveStatus', () => {
    const mockCtx: Context = {
        client: undefined,
        expedition: undefined,
    };

    it('should calculate new positive damage', async () => {
        const status = new ResolveStatus();
        const dto: StatusEffectDTO<DamageArgs> = {
            ctx: mockCtx,
            status: {
                name: resolve.name,
                sourceReference: {
                    type: CardTargetedEnum.Player,
                },
                addedInRound: 1,
                args: {
                    value: 2,
                },
            },
            effectDTO: {
                args: {
                    initialValue: 3,
                    currentValue: 3,
                },
            } as EffectDTO<DamageArgs>,
            update: jest.fn(),
            remove: jest.fn(),
        };
        const result = await status.handle(dto);
        expect(result.args.currentValue).toBe(5);
    });

    it('should calculate new zero damage', async () => {
        const status = new ResolveStatus();
        const dto: StatusEffectDTO<DamageArgs> = {
            ctx: mockCtx,
            status: {
                name: resolve.name,
                sourceReference: {
                    type: CardTargetedEnum.Player,
                },
                addedInRound: 1,
                args: {
                    value: -5,
                },
            },
            effectDTO: {
                args: {
                    initialValue: 3,
                    currentValue: 3,
                },
            } as EffectDTO<DamageArgs>,
            update: jest.fn(),
            remove: jest.fn(),
        };
        const result = await status.handle(dto);
        expect(result.args.currentValue).toBe(0);
    });
});
