import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { Context } from 'src/game/components/interfaces';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { EnergyEffect } from './energy.effect';
import * as MockedSocket from 'socket.io-mock';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { PlayerService } from 'src/game/components/player/player.service';
import { Test } from '@nestjs/testing';

describe('EnergyEffect', () => {
    // Set effect to test
    let energyEffect: EnergyEffect;

    // Mock player
    const mockPlayer: ExpeditionPlayer = {
        type: CardTargetedEnum.Player,
        value: {
            globalState: {
                hpCurrent: 80,
            },
            combatState: {
                energy: 3,
                energyMax: 3,
                handSize: 5,
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

    // Mock player service and the energy effect
    const mockPlayerService = {
        get: jest.fn().mockReturnValue(mockPlayer),
        setEnergy: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        // Initialize nest js testing module
        const module = await Test.createTestingModule({
            providers: [
                EnergyEffect,
                { provide: PlayerService, useValue: mockPlayerService },
            ],
        }).compile();

        energyEffect = module.get(EnergyEffect);

        mockPlayerService.setEnergy.mockClear();
    });

    it('should be defined', () => {
        expect(energyEffect).toBeDefined();
    });

    it('should give energy to player', async () => {
        await energyEffect.handle({
            ctx: mockCtx,
            source: mockPlayer,
            target: mockPlayer,
            args: {
                currentValue: 1,
                initialValue: 1,
            },
        });

        expect(mockPlayerService.setEnergy).toHaveBeenCalledWith(mockCtx, 4);
    });
});
