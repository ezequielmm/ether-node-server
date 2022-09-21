import { Test, TestingModule } from '@nestjs/testing';
import {
    CardTargetedEnum,
    CardTypeEnum,
} from 'src/game/components/card/card.enum';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { stunned } from 'src/game/status/stunned/constants';
import { KnockDownEffect } from './knockDown.effect';
import * as MockedSocket from 'socket.io-mock';
import { StatusService } from 'src/game/status/status.service';

describe('KnockDownEffect', () => {
    let knockDownEffect: KnockDownEffect;
    let statusService: StatusService;
    let historyService: HistoryService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KnockDownEffect,
                {
                    provide: HistoryService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: StatusService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
            ],
        }).compile();

        knockDownEffect = module.get<KnockDownEffect>(KnockDownEffect);
        statusService = module.get<StatusService>(StatusService);
        historyService = module.get<HistoryService>(HistoryService);
        ctx = {
            client: new MockedSocket(),
        };
        source = {};
        target = {};
    });

    it('should be defined', () => {
        expect(knockDownEffect).toBeDefined();
    });

    it('should attach stunned status to enemy', async () => {
        target = {
            type: CardTargetedEnum.Enemy,
            value: {
                id: 'enemy-id',
                combatState: {
                    defense: 10,
                },
            },
        };

        jest.spyOn(historyService, 'get').mockReturnValue([
            {
                type: 'card',
                card: {
                    cardType: CardTypeEnum.Attack,
                },
            } as CardRegistry,
            {
                type: 'card',
                card: {
                    cardType: CardTypeEnum.Attack,
                },
            } as CardRegistry,
        ]);
        await knockDownEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).toHaveBeenCalledWith({
            ctx,
            source,
            target,
            statusName: stunned.name,
            statusArgs: {
                counter: 1,
            },
        });
    });

    it('should not attach stunned status to enemy if does not have 2 attacks in history', async () => {
        target = {
            type: CardTargetedEnum.Enemy,
            value: {
                id: 'enemy-id',
                combatState: {
                    defense: 10,
                },
            },
        };

        jest.spyOn(historyService, 'get').mockReturnValue([
            {
                type: 'card',
                card: {
                    cardType: CardTypeEnum.Attack,
                },
            } as CardRegistry,
        ]);
        await knockDownEffect.handle({ ctx, source, target, args });
        expect(statusService.attach).not.toHaveBeenCalled();
    });
});
