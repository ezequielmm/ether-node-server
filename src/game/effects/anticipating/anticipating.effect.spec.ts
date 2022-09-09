import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { anticipatingStatus } from 'src/game/status/anticipating/constants';
import { AnticipatingEffect } from './anticipating.effect';

describe('AnticipatingEffect', () => {
    let anticipatingEffect: AnticipatingEffect;
    let playerService: PlayerService;
    let enemyService: EnemyService;
    let ctx: any;
    let source: any;
    let target: any;
    let args: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnticipatingEffect,
                {
                    provide: PlayerService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
                {
                    provide: EnemyService,
                    useValue: {
                        attach: jest.fn(),
                    },
                },
            ],
        }).compile();

        anticipatingEffect = module.get<AnticipatingEffect>(AnticipatingEffect);
        playerService = module.get<PlayerService>(PlayerService);
        enemyService = module.get<EnemyService>(EnemyService);
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
        expect(playerService.attach).toHaveBeenCalledWith(
            ctx,
            source,
            anticipatingStatus.name,
            {
                value: 10,
            },
        );
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
        expect(enemyService.attach).toHaveBeenCalledWith(
            ctx,
            'enemyId',
            source,
            anticipatingStatus.name,
            {
                value: 10,
            },
        );
    });
});
