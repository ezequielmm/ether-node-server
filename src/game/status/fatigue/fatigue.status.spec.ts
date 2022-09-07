import { Test } from '@nestjs/testing';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { StatusEffectDTO } from '../interfaces';
import { StatusService } from '../status.service';
import { FatigueStatus } from './fatigue.status';

describe('FatigueStatus', () => {
    let fatigueStatus: FatigueStatus;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FatigueStatus,
                {
                    provide: EnemyService,
                    useValue: {},
                },
                {
                    provide: PlayerService,
                    useValue: {},
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
            ],
        }).compile();

        fatigueStatus = module.get<FatigueStatus>(FatigueStatus);
    });

    it('should be defined', () => {
        expect(fatigueStatus).toBeDefined();
    });

    describe('handle', () => {
        const args: StatusEffectDTO<DamageArgs> = {
            effectDTO: {
                args: {
                    currentValue: 10,
                },
            },
        } as StatusEffectDTO<DamageArgs>;

        it('should return the correct effect', async () => {
            const result = await fatigueStatus.handle(args);
            expect(result.args.currentValue).toBe(7);
        });

        it('should return the correct effect', async () => {
            args.effectDTO.args.currentValue = 0;
            const result = await fatigueStatus.handle(args);
            expect(result.args.currentValue).toBe(0);
        });

        it('should return the correct effect', async () => {
            args.effectDTO.args.currentValue = 8;
            const result = await fatigueStatus.handle(args);
            expect(result.args.currentValue).toBe(6);
        });
    });
});
