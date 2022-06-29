import { Test } from '@nestjs/testing';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { DamageEffect } from './damage.effect';
import { DamageDTO } from './effects.interface';

describe('DamageEffect', () => {
    let effect: DamageEffect;
    const mockExpeditionService = {
        getCurrentNode: jest.fn().mockResolvedValue({
            data: {
                get enemies() {
                    return [{ id: 'targetId', hpCurrent: 100, defense: 5 }];
                },
            },
        }),
        getPlayerStateByClientId: jest.fn().mockResolvedValue({
            hp_current: 100,
        }),
        updatePlayerHp: jest.fn(() => Promise.resolve()),
        updateEnemiesArray: jest.fn(() => Promise.resolve()),
    };

    beforeEach(async () => {
        // Initialize nest js testing module
        const module = await Test.createTestingModule({
            providers: [
                DamageEffect,
                {
                    provide: ExpeditionService,
                    useValue: mockExpeditionService,
                },
            ],
        }).compile();

        effect = module.get(DamageEffect);
        mockExpeditionService.getCurrentNode.mockClear();
        mockExpeditionService.getPlayerStateByClientId.mockClear();
        mockExpeditionService.updatePlayerHp.mockClear();
        mockExpeditionService.updateEnemiesArray.mockClear();
    });

    it('should be defined', () => {
        expect(effect).toBeDefined();
    });

    it('should handle damage to enemy', async () => {
        const payload: DamageDTO = {
            clientId: 'clientId',
            calculatedValue: 10,
            targeted: CardTargetedEnum.Enemy,
            targetId: 'targetId',
            times: 1,
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.clientId,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.clientId,
            enemies: [
                {
                    id: payload.targetId,
                    hpCurrent: 95,
                    defense: 5,
                },
            ],
        });
    });

    it('should handle damage to enemy and trigger damage negated', async () => {
        const payload: DamageDTO = {
            clientId: 'clientId',
            calculatedValue: 4,
            targeted: CardTargetedEnum.Enemy,
            targetId: 'targetId',
            times: 1,
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.clientId,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.clientId,
            enemies: [
                {
                    id: payload.targetId,
                    hpCurrent: 100,
                    defense: 5,
                },
            ],
        });

        // TODO: Test trigger damage negated event
    });

    it('should handle damage for player and trigger death event', async () => {
        const payload: DamageDTO = {
            clientId: 'clientId',
            calculatedValue: 105,
            targeted: CardTargetedEnum.Enemy,
            targetId: 'targetId',
            times: 1,
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.clientId,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.clientId,
            enemies: [
                {
                    id: payload.targetId,
                    hpCurrent: 0,
                    defense: 5,
                },
            ],
        });

        // TODO: Test trigger death event
    });
});
