import { DrawCardEffect } from './drawCard.effect';
import { Test } from '@nestjs/testing';
import { DrawCardAction } from 'src/game/action/drawCard.action';
import {
    CardTargetedEnum,
    CardTypeEnum,
} from 'src/game/components/card/card.enum';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import * as MockedSocket from 'socket.io-mock';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { GameContext } from 'src/game/components/interfaces';
import { SWARMessageType } from 'src/game/standardResponse/standardResponse';
import { EnemyIntentionType } from 'src/game/components/enemy/enemy.enum';

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
    const mockCtx: GameContext = {
        client: new MockedSocket(),
        expedition: {
            currentNode: {
                data: {
                    player: mockPlayer.value.combatState,
                    enemies: [
                        {
                            currentScript: {
                                intentions: [
                                    {
                                        type: EnemyIntentionType.Attack,
                                    },
                                ],
                            },
                        },
                    ],
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

        expect(mockDrawCardAction.handle).toHaveBeenCalledWith({
            client: mockCtx.client,
            amountToTake: 1,
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
            useEnemiesConfusedAsValue: false,
        });
    });

    it('should draw card from draw pile and use enemies that are attacking the player', async () => {
        await drawCardEffect.handle({
            ctx: mockCtx,
            source: mockPlayer,
            target: mockPlayer,
            args: {
                currentValue: 1,
                initialValue: 1,
                useAttackingEnemies: true,
                useEnemiesConfusedAsCost: false,
                checkIfEnemyIsAttacking: false,
            },
        });

        expect(mockDrawCardAction.handle).toHaveBeenCalledWith({
            client: mockCtx.client,
            amountToTake: 2,
            cardType: CardTypeEnum.Defend,
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
            useEnemiesConfusedAsValue: false,
        });
    });

    it('should draw card from draw pile and use enemies that are attacking the player and are confused', async () => {
        await drawCardEffect.handle({
            ctx: mockCtx,
            source: mockPlayer,
            target: mockPlayer,
            args: {
                currentValue: 1,
                initialValue: 1,
                useAttackingEnemies: true,
                useEnemiesConfusedAsCost: true,
                checkIfEnemyIsAttacking: false,
            },
        });

        expect(mockDrawCardAction.handle).toHaveBeenCalledWith({
            client: mockCtx.client,
            amountToTake: 2,
            cardType: CardTypeEnum.Defend,
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
            useEnemiesConfusedAsValue: true,
        });
    });

    it('should draw card from draw pile when enenmy is the target', async () => {
        await drawCardEffect.handle({
            ctx: mockCtx,
            source: mockPlayer,
            target: {
                value: mockCtx.expedition.currentNode.data.enemies[0],
                type: CardTargetedEnum.Enemy,
            },
            args: {
                currentValue: 1,
                initialValue: 1,
                useAttackingEnemies: false,
                useEnemiesConfusedAsCost: false,
                checkIfEnemyIsAttacking: true,
            },
        });

        expect(mockDrawCardAction.handle).toHaveBeenCalledWith({
            client: mockCtx.client,
            amountToTake: 1,
            cardType: CardTypeEnum.Defend,
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
            useEnemiesConfusedAsValue: false,
        });
    });
});
