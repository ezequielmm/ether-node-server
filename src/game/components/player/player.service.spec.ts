import { Test } from '@nestjs/testing';
import { get } from 'lodash';
import { CardTargetedEnum } from '../card/card.enum';
import { CombatQueueService } from '../combatQueue/combatQueue.service';
import { ExpeditionEnemy } from '../enemy/enemy.interface';
import { ExpeditionDocument } from '../expedition/expedition.schema';
import { ExpeditionService } from '../expedition/expedition.service';
import { Context } from '../interfaces';
import {
    PLAYER_DEFENSE_PATH,
    PLAYER_ENERGY_PATH,
    PLAYER_CURRENT_HP_PATH,
} from './contants';
import { PlayerService } from './player.service';
import * as MockedSocket from 'socket.io-mock';
import { StatusService } from 'src/game/status/status.service';

describe('PlayerService', () => {
    const mockExpeditionService = {
        updateById: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    let playerService: PlayerService;

    let mockContext: Context;

    let spyOnSetHp: jest.SpyInstance;
    let spyOnSetDefense: jest.SpyInstance;

    const mockCombatQueueService = {
        addTargetsToCombatQueue: jest
            .fn()
            .mockImplementation(() => Promise.resolve()),
    };

    const mockEventEmitter2 = new MockedSocket();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: ExpeditionService,
                    useValue: mockExpeditionService,
                },
                PlayerService,
                {
                    provide: CombatQueueService,
                    useValue: mockCombatQueueService,
                },
                {
                    provide: StatusService,
                    useValue: {},
                },
            ],
        }).compile();

        playerService = module.get<PlayerService>(PlayerService);
        mockContext = {
            client: mockEventEmitter2,
            expedition: {
                playerState: {
                    hpMax: 80,
                    hpCurrent: 80,
                },
                currentNode: {
                    data: {
                        player: {
                            energy: 0,
                            energyMax: 3,
                            handSize: 5,
                            defense: 5,
                            hpMax: 80,
                            hpCurrent: 80,
                            statuses: { buff: [], debuff: [] },
                        },
                    },
                },
            } as unknown as ExpeditionDocument,
        };

        spyOnSetHp = jest.spyOn(playerService, 'setHp');
        spyOnSetDefense = jest.spyOn(playerService, 'setDefense');
        mockCombatQueueService.addTargetsToCombatQueue.mockClear();
    });

    it('should be defined', () => {
        expect(playerService).toBeDefined();
    });

    describe('isPlayer', () => {
        it('should return true if the target is the player', () => {
            const isPlayer = PlayerService.isPlayer({
                type: CardTargetedEnum.Player,
                value: {
                    globalState: mockContext.expedition.playerState,
                    combatState: mockContext.expedition.currentNode.data.player,
                },
            });

            expect(isPlayer).toBe(true);
        });
        it('should return false if the target is not the player', () => {
            const isPlayer = PlayerService.isPlayer({
                type: CardTargetedEnum.Enemy,
                value: {},
            } as ExpeditionEnemy);

            expect(isPlayer).toBe(false);
        });
    });

    describe('isDead', () => {
        it('should return true if the player is dead', () => {
            mockContext.expedition.playerState.hpCurrent = 0;
            const isDead = playerService.isDead(mockContext);

            expect(isDead).toBe(true);
        });

        it('should return false if the player is alive', () => {
            mockContext.expedition.playerState.hpCurrent = 10;
            const isDead = playerService.isDead(mockContext);

            expect(isDead).toBe(false);
        });
    });

    describe('get', () => {
        it('should return player data', async () => {
            const playerState = await playerService.get(mockContext);
            expect(playerState).toEqual({
                type: CardTargetedEnum.Player,
                value: {
                    globalState: mockContext.expedition.playerState,
                    combatState: mockContext.expedition.currentNode.data.player,
                },
            });
        });
    });

    describe('defend', () => {
        it('should update the player defense', async () => {
            await playerService.setDefense(mockContext, 10);
            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_DEFENSE_PATH]: 10,
                },
            );

            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(10);
        });
    });

    describe('energize', () => {
        it('should update the player energy', async () => {
            await playerService.setEnergy(mockContext, 10);
            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_ENERGY_PATH]: 10,
                },
            );
            expect(get(mockContext.expedition, PLAYER_ENERGY_PATH)).toBe(10);
        });
    });

    describe('heal', () => {
        it('should update the player health', async () => {
            await playerService.setHp(mockContext, 10);

            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_CURRENT_HP_PATH]: 10,
                },
            );

            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(
                10,
            );
        });

        it('should heal to max hp', async () => {
            await playerService.setHp(mockContext, 90);
            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_CURRENT_HP_PATH]: 80,
                },
            );
            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(
                80,
            );
        });
    });

    describe('damage', () => {
        it('should update the player health', async () => {
            mockContext.expedition.currentNode.data.player.defense = 0;

            await playerService.damage(mockContext, 10, '1');

            expect(spyOnSetDefense).toHaveBeenCalledWith(mockContext, 0);
            expect(spyOnSetHp).toHaveBeenCalledWith(mockContext, 70);

            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(
                70,
            );
            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(0);
            expect(
                mockCombatQueueService.addTargetsToCombatQueue,
            ).toHaveBeenCalledWith('1', [
                expect.objectContaining({
                    defenseDelta: 0,
                    effectType: 'damage',
                    finalDefense: 0,
                    finalHealth: 70,
                    healthDelta: -10,
                }),
            ]);
        });

        it('should update the player health', async () => {
            await playerService.damage(mockContext, 0, '1');

            expect(spyOnSetDefense).toHaveBeenCalledWith(mockContext, 5);
            expect(spyOnSetHp).toHaveBeenCalledWith(mockContext, 80);

            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(
                80,
            );
            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(5);
            expect(
                mockCombatQueueService.addTargetsToCombatQueue,
            ).toHaveBeenCalledWith('1', [
                expect.objectContaining({
                    defenseDelta: -0,
                    effectType: 'damage',
                    finalDefense: 5,
                    finalHealth: 0,
                    healthDelta: 0,
                }),
            ]);
        });

        it('should update the player health to 0 if the damage is greater than the current health', async () => {
            await playerService.damage(mockContext, 85, '1');

            expect(spyOnSetDefense).toHaveBeenCalledWith(mockContext, 0);
            expect(spyOnSetHp).toHaveBeenCalledWith(mockContext, 0);

            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(0);
            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(0);
            expect(
                mockCombatQueueService.addTargetsToCombatQueue,
            ).toHaveBeenCalledWith('1', [
                expect.objectContaining({
                    defenseDelta: -85,
                    effectType: 'damage',
                    finalDefense: 0,
                    finalHealth: 0,
                    healthDelta: -80,
                }),
            ]);
        });
    });

    // TODO: Add attack tests
});
