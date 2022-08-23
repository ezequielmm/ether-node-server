import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { HealEffect } from './heal.effect';
import * as MockedSocket from 'socket.io-mock';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { Context } from 'src/game/components/interfaces';

describe('HealEffect', () => {
    // Set effect to test
    let healEffect: HealEffect;

    // Mock player
    const mockPlayer: ExpeditionPlayer = {
        type: CardTargetedEnum.Player,
        value: {
            globalState: {
                hpCurrent: 75,
                hpMax: 80,
            },
            combatState: {
                hpCurrent: 75,
                hpMax: 80,
                energy: 3,
                energyMax: 3,
                handSize: 5,
                defense: 0,
            },
        },
    } as ExpeditionPlayer;

    // Mock enemy
    const mockEnemy: ExpeditionEnemy = {
        type: CardTargetedEnum.Enemy,
        value: { id: '123', defense: 0, hpCurrent: 75, hpMax: 80 },
    } as ExpeditionEnemy;

    // Mock context
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

    // Mock player service and the defense effect
    const mockPlayerService = {
        setHp: jest.fn().mockResolvedValue(undefined),
    };

    // Mock enemy service and the defense effect
    const mockEnemyService = {
        setHp: jest.fn().mockResolvedValue(undefined),
    };

    // Mock combat queue service
    const mockCombatQueueService = {
        addTargetsToCombatQueue: jest
            .fn()
            .mockImplementation(() => Promise.resolve()),
    };

    beforeEach(async () => {
        // Initialize nest js testing module
        const module = await Test.createTestingModule({
            providers: [
                HealEffect,
                { provide: PlayerService, useValue: mockPlayerService },
                { provide: EnemyService, useValue: mockEnemyService },
                {
                    provide: CombatQueueService,
                    useValue: mockCombatQueueService,
                },
                { provide: EventEmitter2, useValue: new EventEmitter2() },
            ],
        }).compile();

        healEffect = module.get(HealEffect);

        mockPlayerService.setHp.mockClear();
        mockEnemyService.setHp.mockClear();
        mockCombatQueueService.addTargetsToCombatQueue.mockClear();
    });

    it('should be defined', () => {
        expect(healEffect).toBeDefined();
    });

    describe('Player heal', () => {
        it('should heal the player', async () => {
            await healEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockPlayer,
                args: {
                    initialValue: 5,
                    currentValue: 5,
                    value: 5,
                },
                combatQueueId: '555',
            });

            expect(mockPlayerService.setHp).toHaveBeenCalledWith(mockCtx, 80);
        });

        it('should set the maxHp for the player', async () => {
            await healEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockPlayer,
                args: {
                    initialValue: 10,
                    currentValue: 10,
                    value: 10,
                },
                combatQueueId: '555',
            });

            expect(mockPlayerService.setHp).toHaveBeenCalledWith(mockCtx, 80);
        });
    });

    describe('Enemy heal', () => {
        it('should heal the enemy', async () => {
            await healEffect.handle({
                ctx: mockCtx,
                source: mockEnemy,
                target: mockEnemy,
                args: {
                    initialValue: 5,
                    currentValue: 5,
                    value: 5,
                },
                combatQueueId: '555',
            });

            expect(mockEnemyService.setHp).toHaveBeenCalledWith(
                mockCtx,
                '123',
                80,
            );
        });

        it('should set the maxHp for the enemy', async () => {
            await healEffect.handle({
                ctx: mockCtx,
                source: mockEnemy,
                target: mockEnemy,
                args: {
                    initialValue: 10,
                    currentValue: 10,
                    value: 10,
                },
                combatQueueId: '555',
            });

            expect(mockEnemyService.setHp).toHaveBeenCalledWith(
                mockCtx,
                '123',
                80,
            );
        });
    });
});
