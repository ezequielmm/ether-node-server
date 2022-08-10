import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { Context } from 'src/game/components/interfaces';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { DefenseEffect } from './defense.effect';
import * as MockedSocket from 'socket.io-mock';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Test } from '@nestjs/testing';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';

describe('DefenseEffect', () => {
    // Set effect to test
    let defenseEffect: DefenseEffect;

    // Mock player
    const mockPlayer: ExpeditionPlayer = {
        type: CardTargetedEnum.Player,
        value: {
            globalState: {},
            combatState: {
                energy: 3,
                defense: 0,
            },
        },
    } as ExpeditionPlayer;

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
        get: jest.fn().mockReturnValue(mockPlayer),
        setDefense: jest.fn().mockResolvedValue(undefined),
    };

    // Mock enemy service and the defense effect
    const mockEnemyService = {
        setDefense: jest.fn().mockResolvedValue(undefined),
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
                DefenseEffect,
                { provide: PlayerService, useValue: mockPlayerService },
                { provide: EnemyService, useValue: mockEnemyService },
                {
                    provide: CombatQueueService,
                    useValue: mockCombatQueueService,
                },
                { provide: EventEmitter2, useValue: new EventEmitter2() },
            ],
        }).compile();

        defenseEffect = module.get(DefenseEffect);

        mockPlayerService.get.mockClear();
        mockPlayerService.setDefense.mockClear();
        mockEnemyService.setDefense.mockClear();
        mockCombatQueueService.addTargetsToCombatQueue.mockClear();
    });

    it('should be defined', () => {
        expect(defenseEffect).toBeDefined();
    });

    describe('Player defense', () => {
        it('should give defense to the player', async () => {
            await defenseEffect.handle({
                ctx: mockCtx,
                source: mockPlayer,
                target: mockPlayer,
                args: {
                    currentValue: 5,
                    initialValue: 5,
                    useEnemies: false,
                    useAttackingEnemies: false,
                    useDiscardPileAsValue: false,
                    multiplier: 1,
                },
                combatQueueId: '555',
            });

            expect(mockPlayerService.setDefense).toHaveBeenCalledWith(
                mockCtx,
                5,
                '555',
            );
        });
    });
});
