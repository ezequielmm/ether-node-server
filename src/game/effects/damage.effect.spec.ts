import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { IExpeditionCurrentNodeDataEnemy } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { DamageArgs, DamageEffect } from './damage.effect';
import { EffectDTO } from './effects.interface';

describe('DamageEffect', () => {
    let effect: DamageEffect;
    const client = {
        id: 'clientId',
        emit: jest.fn(),
    } as unknown as Socket;
    const mockExpeditionService = {
        getCurrentNode: jest.fn().mockResolvedValue({
            data: {
                get enemies() {
                    return [{ id: 'targetId', hpCurrent: 100, defense: 5 }];
                },
                get player() {
                    return { id: 'playerId', defense: 5 };
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
        const payload: EffectDTO<DamageArgs> = {
            client,
            args: {
                initialValue: 10,
                currentValue: 10,
            },
            source: undefined,
            target: {
                type: CardTargetedEnum.Enemy,
                value: { id: 'targetId' } as IExpeditionCurrentNodeDataEnemy,
            },
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.client.id,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.client.id,
            enemies: [
                {
                    id: payload.target.value['id'],
                    hpCurrent: 95,
                    defense: 5,
                },
            ],
        });
    });

    it('should handle damage to enemy and trigger damage negated', async () => {
        const payload: EffectDTO<DamageArgs> = {
            client,
            args: {
                initialValue: 4,
                currentValue: 4,
            },
            source: undefined,
            target: {
                type: CardTargetedEnum.Enemy,
                value: { id: 'targetId' } as IExpeditionCurrentNodeDataEnemy,
            },
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.client.id,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.client.id,
            enemies: [
                {
                    id: payload.target.value['id'],
                    hpCurrent: 100,
                    defense: 5,
                },
            ],
        });

        // TODO: Test trigger damage negated event
    });

    it('should handle damage for player and trigger death event', async () => {
        const payload: EffectDTO<DamageArgs> = {
            client,
            args: {
                initialValue: 105,
                currentValue: 105,
            },
            source: undefined,
            target: {
                type: CardTargetedEnum.Enemy,
                value: { id: 'targetId' } as IExpeditionCurrentNodeDataEnemy,
            },
        };

        await effect.handle(payload);

        expect(mockExpeditionService.getCurrentNode).toHaveBeenCalledWith({
            clientId: payload.client.id,
        });

        expect(mockExpeditionService.updateEnemiesArray).toHaveBeenCalledWith({
            clientId: payload.client.id,
            enemies: [
                {
                    id: payload.target.value['id'],
                    hpCurrent: 0,
                    defense: 5,
                },
            ],
        });

        // TODO: Test trigger death event
    });
});
