import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { resolve } from 'src/game/status/resolve/constants';
import { StatusService } from 'src/game/status/status.service';
import { DoubleResolveEffect } from './doubleResolve.effect';

describe('DoubleResolveEffect', () => {
    let doubleResolveEffect: DoubleResolveEffect;
    let statusService: StatusService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DoubleResolveEffect,
                {
                    provide: StatusService,
                    useValue: {
                        updateStatuses: jest.fn(),
                    },
                },
            ],
        }).compile();

        doubleResolveEffect =
            module.get<DoubleResolveEffect>(DoubleResolveEffect);
        statusService = module.get<StatusService>(StatusService);
        ctx = {
            expedition: {},
        };
        source = {};
        target = {};
    });

    it('should be defined', () => {
        expect(doubleResolveEffect).toBeDefined();
    });

    it('should double resolve status value', async () => {
        target = {
            type: CardTargetedEnum.Player,
            value: {
                combatState: {
                    statuses: {
                        buff: [
                            {
                                name: resolve.name,
                                args: {
                                    counter: 2,
                                },
                            },
                        ],
                    },
                },
            },
        };
        await doubleResolveEffect.handle({ ctx, source, target, args });
        expect(target.value.combatState.statuses.buff[0].args.counter).toBe(4);
        expect(statusService.updateStatuses).toHaveBeenCalledWith(
            target,
            ctx.expedition,
            {
                buff: [
                    {
                        name: resolve.name,
                        args: {
                            counter: 4,
                        },
                    },
                ],
            },
        );
    });

    it('should not double resolve status value if not present', async () => {
        target = {
            type: CardTargetedEnum.Player,
            value: {
                combatState: {
                    statuses: {
                        buff: [
                            {
                                name: 'not resolve',
                                args: {
                                    value: 2,
                                },
                            },
                        ],
                    },
                },
            },
        };
        await doubleResolveEffect.handle({ ctx, source, target, args });
        expect(target.value.combatState.statuses.buff[0].args.value).toBe(2);
        expect(statusService.updateStatuses).not.toHaveBeenCalled();
    });
});
