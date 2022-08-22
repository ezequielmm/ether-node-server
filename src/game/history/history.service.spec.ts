import { Test, TestingModule } from '@nestjs/testing';
import { CardTargetedEnum } from '../components/card/card.enum';
import { HistoryService } from './history.service';
import { EffectRegistry } from './interfaces';

describe('HistoryService', () => {
    let service: HistoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HistoryService],
        }).compile();

        service = module.get<HistoryService>(HistoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should register an effect in the history', () => {
            const clientId = 'client-id';
            const registry: EffectRegistry = {
                type: 'effect',
                effect: {
                    effect: 'effect-name',
                    args: {
                        value: 1,
                    },
                },
                source: {
                    type: CardTargetedEnum.Enemy,
                    id: 'enemy-id',
                },
                target: {
                    type: CardTargetedEnum.Player,
                },
            };

            service.register({ clientId, registry });

            expect(service.get(clientId)).toEqual([registry]);
        });
    });

    describe('findLast', () => {
        it('should return the last effect in the history', () => {
            const clientId = 'client-id';
            const registryA: EffectRegistry = {
                type: 'effect',
                effect: {
                    effect: 'effect-name',
                    args: {
                        value: 1,
                    },
                },
                source: {
                    type: CardTargetedEnum.Enemy,
                    id: 'enemy-id',
                },
                target: {
                    type: CardTargetedEnum.Player,
                },
            };

            const registryB: EffectRegistry = {
                type: 'effect',
                effect: {
                    effect: 'effect-name',
                    args: {
                        value: 2,
                    },
                },
                source: {
                    type: CardTargetedEnum.Enemy,
                    id: 'enemy-id',
                },
                target: {
                    type: CardTargetedEnum.Player,
                },
            };

            service.register({ clientId, registry: registryA });
            service.register({ clientId, registry: registryB });

            expect(
                service.findLast(clientId, {
                    type: 'effect',
                    effect: {
                        effect: 'effect-name',
                    },
                }),
            ).toEqual(registryB);
        });
    });

    describe('clear', () => {
        it('should clear the history of a client', () => {
            const clientId = 'client-id';
            const registry: EffectRegistry = {
                type: 'effect',
                effect: {
                    effect: 'effect-name',
                    args: {
                        value: 1,
                    },
                },
                source: {
                    type: CardTargetedEnum.Enemy,
                    id: 'enemy-id',
                },
                target: {
                    type: CardTargetedEnum.Player,
                },
            };

            service.register({ clientId, registry });
            service.clear(clientId);

            expect(service.get(clientId)).toEqual([]);
        });
    });
});
