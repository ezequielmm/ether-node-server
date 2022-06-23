import { Test } from '@nestjs/testing';
import { CardTargetedEnum } from '../components/card/enums';
import { ExpeditionService } from '../expedition/expedition.service';
import { DamageEffect } from './damage.effect';

describe('DamageEffect', () => {
    let effect: DamageEffect;
    const mockExpeditionService = {
        getCurrentNodeByClientId: jest.fn().mockResolvedValue({
            data: { player: { defense: 5 } },
        }),
        getPlayerStateByClientId: jest.fn().mockResolvedValue({
            hp_current: 100,
        }),
        updatePlayerHp: jest.fn(() => Promise.resolve()),
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
        mockExpeditionService.getCurrentNodeByClientId.mockClear();
        mockExpeditionService.getPlayerStateByClientId.mockClear();
        mockExpeditionService.updatePlayerHp.mockClear();
    });

    it('should be defined', () => {
        expect(effect).toBeDefined();
    });

    it('should handle damage for player', async () => {
        const payload = {
            client_id: 'client_id',
            value: 10,
            targeted: CardTargetedEnum.Player,
        };

        await effect.handle(payload);

        expect(
            mockExpeditionService.getCurrentNodeByClientId,
        ).toHaveBeenCalledWith(payload.client_id);

        expect(
            mockExpeditionService.getPlayerStateByClientId,
        ).toHaveBeenCalledWith({ client_id: payload.client_id });

        expect(mockExpeditionService.updatePlayerHp).toHaveBeenCalledWith({
            client_id: payload.client_id,
            hp: 95,
        });
    });

    it('should handle damage for player and trigger damage negated', async () => {
        const payload = {
            client_id: 'client_id',
            value: 4,
            targeted: CardTargetedEnum.Player,
        };

        await effect.handle(payload);

        expect(
            mockExpeditionService.getCurrentNodeByClientId,
        ).toHaveBeenCalledWith(payload.client_id);

        expect(
            mockExpeditionService.getPlayerStateByClientId,
        ).toHaveBeenCalledWith({ client_id: payload.client_id });

        expect(mockExpeditionService.updatePlayerHp).toHaveBeenCalledTimes(0);

        // TODO: Test trigger damage negated event
    });

    it('should handle damage for player and trigger death event', async () => {
        const payload = {
            client_id: 'client_id',
            value: 105,
            targeted: CardTargetedEnum.Player,
        };

        await effect.handle(payload);

        expect(
            mockExpeditionService.getCurrentNodeByClientId,
        ).toHaveBeenCalledWith(payload.client_id);

        expect(
            mockExpeditionService.getPlayerStateByClientId,
        ).toHaveBeenCalledWith({ client_id: payload.client_id });

        expect(mockExpeditionService.updatePlayerHp).toHaveBeenCalledTimes(0);

        // TODO: Test trigger death event
    });
});
