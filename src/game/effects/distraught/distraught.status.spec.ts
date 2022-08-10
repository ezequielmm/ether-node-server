import { Test } from '@nestjs/testing';
import { StatusEffectDTO } from 'src/game/status/interfaces';
import { DamageArgs } from '../damage/damage.effect';
import { DistraughtStatus } from './distraught.status';

describe('DistraughtStatus', () => {
    let distraughtStatus: DistraughtStatus;
    let spyOnHandle: jest.SpyInstance;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [DistraughtStatus],
        }).compile();

        distraughtStatus = module.get(DistraughtStatus);
        spyOnHandle = jest.spyOn(distraughtStatus, 'handle');
    });

    it('should be defined', () => {
        expect(distraughtStatus).toBeDefined();
    });

    describe('Preview', () => {
        it('should preview', async () => {
            const args = {
                effectDTO: {
                    args: {
                        currentValue: 4,
                        initialValue: 4,
                    },
                },
            } as StatusEffectDTO<DamageArgs>;

            await distraughtStatus.preview(args);
            expect(spyOnHandle).toHaveBeenCalledWith(args);
        });
    });

    describe('Handle', () => {
        it('should handle', async () => {
            const args = {
                effectDTO: {
                    args: {
                        currentValue: 4,
                        initialValue: 4,
                    },
                },
            } as StatusEffectDTO<DamageArgs>;

            const effectDTO = await distraughtStatus.handle(args);

            expect(effectDTO).toEqual({
                args: {
                    currentValue: 6,
                    initialValue: 4,
                },
            });
        });

        it('should handle using Math.floor', async () => {
            const args = {
                effectDTO: {
                    args: {
                        currentValue: 3,
                        initialValue: 3,
                    },
                },
            } as StatusEffectDTO<DamageArgs>;

            const effectDTO = await distraughtStatus.handle(args);

            expect(effectDTO).toEqual({
                args: {
                    currentValue: 4,
                    initialValue: 3,
                },
            });
        });
    });
});
