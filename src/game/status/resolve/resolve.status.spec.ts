import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { Context } from 'src/game/components/interfaces';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectDTO } from '../interfaces';
import { resolveStatus } from './constants';
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
                name: resolveStatus.name,
                sourceReference: {
                    type: CardTargetedEnum.Player,
                },
                addedInRound: 1,
                args: {
                    counter: 2,
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
                name: resolveStatus.name,
                sourceReference: {
                    type: CardTargetedEnum.Player,
                },
                addedInRound: 1,
                args: {
                    counter: -5,
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
