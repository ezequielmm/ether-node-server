import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { anticipatingStatus } from 'src/game/status/anticipating/constants';
import { StatusService } from 'src/game/status/status.service';
import { AnticipatingEffect } from './anticipating.effect';

describe('AnticipatingEffect', () => {
    let anticipatingEffect: AnticipatingEffect;
    let statusService: StatusService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnticipatingEffect,
                {
                    provide: StatusService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
            ],
        }).compile();

        anticipatingEffect = module.get<AnticipatingEffect>(AnticipatingEffect);
        statusService = module.get<StatusService>(StatusService);
        ctx = {};
        source = {};
        target = {};
    });

    it('should be defined', () => {
        expect(anticipatingEffect).toBeDefined();
    });

    it('should attach anticipating status to player', async () => {
        target = {
            type: CardTargetedEnum.Player,
            value: {
                combatState: {
                    defense: 10,
                },
            },
        };
        await anticipatingEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).toHaveBeenCalledWith({
            ctx,
            source,
            target,
            statusName: anticipatingStatus.name,
            statusArgs: {
                counter: target.value.combatState.defense,
            },
        });
    });

    it('should attach anticipating status to enemy', async () => {
        target = {
            type: CardTargetedEnum.Enemy,
            value: {
                id: 'enemyId',
                defense: 10,
            },
        };
        await anticipatingEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).toHaveBeenCalledWith({
            ctx,
            source,
            target,
            statusName: anticipatingStatus.name,
            statusArgs: {
                counter: target.value.defense,
            },
        });
    });
});
