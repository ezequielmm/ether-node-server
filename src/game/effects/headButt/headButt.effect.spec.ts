import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { confusion } from 'src/game/status/confusion/constants';
import { StatusService } from 'src/game/status/status.service';
import { HeadButtEffect } from './headButt.effect';

// Should attach confusion status if target defense equals to 0
describe('HeadButEffect', () => {
    let headButtEffect: HeadButtEffect;
    let statusService: StatusService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HeadButtEffect,
                {
                    provide: StatusService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
            ],
        }).compile();

        headButtEffect = module.get<HeadButtEffect>(HeadButtEffect);
        statusService = module.get<StatusService>(StatusService);
        ctx = {};
        source = {};
        target = {};
    });

    it('should be defined', () => {
        expect(headButtEffect).toBeDefined();
    });

    it('should attach confusion status if target defense equals to 0', async () => {
        target = {
            type: CardTargetedEnum.Enemy,
            value: {
                defense: 0,
            },
        };
        await headButtEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).toHaveBeenCalledWith({
            ctx,
            source,
            statuses: [
                {
                    name: confusion.name,
                    args: {
                        attachTo: target.type,
                        value: 1,
                    },
                },
            ],
        });
    });

    it('should not attach confusion status if target defense is greater than 0', async () => {
        target = {
            type: CardTargetedEnum.Enemy,
            value: {
                defense: 1,
            },
        };
        await headButtEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).not.toHaveBeenCalled();
    });
});
