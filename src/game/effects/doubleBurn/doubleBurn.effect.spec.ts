import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { burn } from 'src/game/status/burn/constants';
import { StatusService } from 'src/game/status/status.service';
import { DoubleBurnEffect } from './doubleBurn.effect';
import { CombatQueueService } from '../../components/combatQueue/combatQueue.service';

describe('DoubleBurnEffect', () => {
    let doubleBurnEffect: DoubleBurnEffect;
    let statusService: StatusService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    const mockCombatQueueService = {
        push: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DoubleBurnEffect,
                {
                    provide: StatusService,
                    useValue: {
                        updateStatuses: jest.fn(),
                    },
                },
                {
                    provide: CombatQueueService,
                    useValue: mockCombatQueueService,
                },
                {
                    provide: EnemyService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
            ],
        }).compile();

        doubleBurnEffect = module.get<DoubleBurnEffect>(DoubleBurnEffect);
        statusService = module.get<StatusService>(StatusService);
        ctx = {
            expedition: {},
        };
        source = {};
        target = {};
    });

    it('should be defined', () => {
        expect(doubleBurnEffect).toBeDefined();
    });

    it('should double burn status value', async () => {
        target = {
            type: CardTargetedEnum.Player,
            value: {
                combatState: {
                    statuses: {
                        debuff: [
                            {
                                name: burn.name,
                                args: {
                                    counter: 2,
                                },
                            },
                        ],
                    },
                },
            },
        };
        await doubleBurnEffect.handle({ ctx, source, target, args });
        expect(target.value.combatState.statuses.debuff[0].args.counter).toBe(
            4,
        );
        expect(statusService.updateStatuses).toHaveBeenCalledWith(
            target,
            ctx.expedition,
            target.value.combatState.statuses,
        );
    });

    it('should not double burn status value if no burn status', async () => {
        target = {
            type: CardTargetedEnum.Player,
            value: {
                combatState: {
                    statuses: {
                        debuff: [],
                    },
                },
            },
        };
        await doubleBurnEffect.handle({ ctx, source, target, args });
        expect(statusService.updateStatuses).not.toHaveBeenCalled();
    });
});
