import { Test, TestingModule } from '@nestjs/testing';
import {
    CardTargetedEnum,
    CardTypeEnum,
} from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { stunned } from 'src/game/status/stunned/constants';
import { KnockDownEffect } from './knockDown.effect';
import * as MockedSocket from 'socket.io-mock';

describe('KnockDownEffect', () => {
    let knockDownEffect: KnockDownEffect;
    let enemyService: EnemyService;
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
                    provide: EnemyService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
                {
                    provide: HistoryService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        knockDownEffect = module.get<KnockDownEffect>(KnockDownEffect);
        enemyService = module.get<EnemyService>(EnemyService);
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
        expect(enemyService.attach).toHaveBeenCalledWith(
            ctx,
            target.value.id,
            source,
            stunned.name,
        );
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
        expect(enemyService.attach).not.toHaveBeenCalled();
    });
});
