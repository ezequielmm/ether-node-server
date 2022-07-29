import { Test } from '@nestjs/testing';
import { get } from 'lodash';
import { CardTargetedEnum } from '../card/card.enum';
import { ExpeditionDocument } from '../expedition/expedition.schema';
import { ExpeditionService } from '../expedition/expedition.service';
import { Context } from '../interfaces';
import {
    PLAYER_DEFENSE_PATH,
    PLAYER_ENERGY_PATH,
    PLAYER_CURRENT_HP_PATH,
} from './contants';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
    const mockExpeditionService = {
        updateById: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    let playerService: PlayerService;
    let mockContext: Context;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                { provide: ExpeditionService, useValue: mockExpeditionService },
                PlayerService,
            ],
        }).compile();

        playerService = module.get<PlayerService>(PlayerService);
        mockContext = {
            client: null,
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
                        },
                    },
                },
            } as unknown as ExpeditionDocument,
        };
    });

    it('should be defined', () => {
        expect(playerService).toBeDefined();
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
            await playerService.setHealt(mockContext, 10);
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
            await playerService.setHealt(mockContext, 90);
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
            await playerService.damage(mockContext, 0);
            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_CURRENT_HP_PATH]: 80,
                    [PLAYER_DEFENSE_PATH]: 5,
                },
            );
            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(
                80,
            );
            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(5);
        });

        it('should update the player health to 0 if the damage is greater than the current health', async () => {
            await playerService.damage(mockContext, 85);
            expect(mockExpeditionService.updateById).toHaveBeenCalledWith(
                mockContext.expedition.id,
                {
                    [PLAYER_CURRENT_HP_PATH]: 0,
                    [PLAYER_DEFENSE_PATH]: 0,
                },
            );
            expect(get(mockContext.expedition, PLAYER_CURRENT_HP_PATH)).toBe(0);
            expect(get(mockContext.expedition, PLAYER_DEFENSE_PATH)).toBe(0);
        });
    });
});
