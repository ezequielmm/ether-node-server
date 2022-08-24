import { DrawCardEffect } from './drawCard.effect';
import { Test } from '@nestjs/testing';
import { DrawCardAction } from 'src/game/action/drawCard.action';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import * as MockedSocket from 'socket.io-mock';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';

describe('DrawCardEffect', () => {
    let drawCardEffect: DrawCardEffect;

    // Mock player
    const mockPlayer: ExpeditionPlayer = {
        type: CardTargetedEnum.Player,
        value: {
            combatState: {
                handSize: 5,
                cards: {
                    exhausted: [],
                    discard: [],
                    hand: [],
                    draw: [],
                },
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

    // Mock drawCardAction
    const mockDrawCardAction = {
        handle: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    beforeEach(async () => {
        // Initialize nest js testing module
        const module = await Test.createTestingModule({
            providers: [
                DrawCardEffect,
                {
                    provide: DrawCardAction,
                    useValue: mockDrawCardAction,
                },
            ],
        }).compile();

        drawCardEffect = module.get(DrawCardEffect);

        mockDrawCardAction.handle.mockClear();
    });

    it('should be defined', () => {
        expect(drawCardEffect).toBeDefined();
    });

    it('should draw card from draw pile', async () => {
        await drawCardEffect.handle({
            ctx: mockCtx,
            source: mockPlayer,
            target: mockPlayer,
            args: {
                currentValue: 1,
                initialValue: 1,
                useAttackingEnemies: false,
                useEnemiesConfusedAsCost: false,
                checkIfEnemyIsAttacking: false,
            },
        });
    });
});
