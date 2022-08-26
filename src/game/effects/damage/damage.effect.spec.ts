import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import * as MockedSocket from 'socket.io-mock';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { CardTargetedEnum } from '../../components/card/card.enum';
import { DamageEffect } from './damage.effect';

describe('DamageEffect', () => {
    let damageEffect: DamageEffect;
    const mockPlayer: ExpeditionPlayer = {
        type: CardTargetedEnum.Player,
        value: {
            globalState: {},
            combatState: {
                energy: 3,
                defense: 7,
            },
        },
    } as ExpeditionPlayer;

    const mockEnemy: ExpeditionEnemy = {
        type: CardTargetedEnum.Enemy,
        value: { id: '123' },
    } as ExpeditionEnemy;

    const mockCtx: Context = {
        client: new MockedSocket(),
        expedition: {
            currentNode: {
                data: {
                    player: mockPlayer.value.combatState,
                },
            },
        } as ExpeditionDocument,
    };

    const mockPlayerService = {
        get: jest.fn().mockReturnValue(mockPlayer),
        damage: jest.fn().mockResolvedValue(undefined),
    };

    const mockEnemyService = {
        damage: jest.fn().mockResolvedValue(undefined),
    };

    const mockCombatQueueService = {
        push: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        // Initialize nest js testing module
        const module = await Test.createTestingModule({
            providers: [
                DamageEffect,
                { provide: PlayerService, useValue: mockPlayerService },
                { provide: EnemyService, useValue: mockEnemyService },
                { provide: EventEmitter2, useValue: new EventEmitter2() },
                {
                    provide: CombatQueueService,
                    useValue: mockCombatQueueService,
                },
            ],
        }).compile();

        damageEffect = module.get(DamageEffect);

        mockPlayerService.get.mockClear();
        mockPlayerService.damage.mockClear();
        mockEnemyService.damage.mockClear();
    });

    it('should be defined', () => {
        expect(damageEffect).toBeDefined();
    });

    describe('Player damage', () => {
        it('should damage player', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockEnemy,
                target: mockPlayer,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                },
                combatQueueId: '555',
            });
            expect(mockPlayerService.damage).toHaveBeenCalledWith(mockCtx, 4);
        });

        it('should damage player with energy as value', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockEnemy,
                target: mockPlayer,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                    useEnergyAsValue: true,
                },
            });
            expect(mockPlayerService.damage).toHaveBeenCalledWith(mockCtx, 3);
        });
    });

    describe('Enemy damage', () => {
        it('should damage enemy', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockEnemy,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                },
            });
            expect(mockEnemyService.damage).toHaveBeenCalledWith(
                mockCtx,
                '123',
                4,
            );
        });

        it('should damage enemy with energy as multiplier', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockEnemy,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                    useEnergyAsMultiplier: true,
                },
            });
            expect(mockEnemyService.damage).toHaveBeenCalledWith(
                mockCtx,
                '123',
                12,
            );
        });

        it('should damage enemy with defense as multiplier', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockEnemy,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                    useDefense: true,
                    multiplier: 2,
                },
            });
            expect(mockEnemyService.damage).toHaveBeenCalledWith(
                mockCtx,
                '123',
                56,
            );
        });

        it('should damage enemy with defense and energy as multiplier', async () => {
            await damageEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockEnemy,
                args: {
                    currentValue: 4,
                    initialValue: 4,
                    useDefense: true,
                    useEnergyAsMultiplier: true,
                    multiplier: 2,
                },
            });
            expect(mockEnemyService.damage).toHaveBeenCalledWith(
                mockCtx,
                '123',
                168,
            );
        });
    });
});
