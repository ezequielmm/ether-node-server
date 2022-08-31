import { Test } from '@nestjs/testing';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { HistoryService } from 'src/game/history/history.service';
import { StatusService } from 'src/game/status/status.service';
import { EffectService } from '../effects.service';
import { TwistTheBladeEffect } from './twistTheBlade.effect';
import * as MockedSocket from 'socket.io-mock';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { damageEffect } from '../damage/constants';

describe('TwistTheBlade', () => {
    const mockCtx: Context = {
        client: new MockedSocket(),
        expedition: {} as unknown as ExpeditionDocument,
    };

    let twistTheBladeEffect: TwistTheBladeEffect;
    let effectService: EffectService;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                TwistTheBladeEffect,
                {
                    provide: HistoryService,
                    useValue: {
                        findLast: jest.fn().mockReturnValue({
                            effect: {
                                args: {
                                    value: 1,
                                },
                            },
                        }),
                    },
                },
                {
                    provide: StatusService,
                    useValue: {
                        getReferenceFromEntity: jest.fn().mockReturnValue({
                            type: CardTargetedEnum.Player,
                        }),
                    },
                },
                {
                    provide: EffectService,
                    useValue: {
                        apply: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        twistTheBladeEffect = app.get<TwistTheBladeEffect>(TwistTheBladeEffect);
        effectService = app.get<EffectService>(EffectService);
    });

    it('should be defined', () => {
        expect(twistTheBladeEffect).toBeDefined();
    });

    it('should apply damage based on the last damage effect', async () => {
        const source: ExpeditionPlayer = {
            type: CardTargetedEnum.Player,
            value: {},
        } as unknown as ExpeditionPlayer;

        const target: ExpeditionEnemy = {
            type: CardTargetedEnum.Enemy,
            value: {
                defense: 0,
            },
        } as unknown as ExpeditionEnemy;

        await twistTheBladeEffect.handle({
            ctx: mockCtx,
            source,
            target,
            args: undefined,
        });

        expect(effectService.apply).toHaveBeenCalledWith({
            ctx: mockCtx,
            source,
            target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: 1,
                },
            },
        });
    });

    it('should apply damage based on the last damage effect with defense and double the damage', async () => {
        const source: ExpeditionPlayer = {
            type: CardTargetedEnum.Player,
            value: {},
        } as unknown as ExpeditionPlayer;

        const target: ExpeditionEnemy = {
            type: CardTargetedEnum.Enemy,
            value: {
                defense: 1,
            },
        } as unknown as ExpeditionEnemy;

        await twistTheBladeEffect.handle({
            ctx: mockCtx,
            source,
            target,
            args: undefined,
        });

        expect(effectService.apply).toHaveBeenCalledWith({
            ctx: mockCtx,
            source,
            target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: 2,
                },
            },
        });
    });
});
