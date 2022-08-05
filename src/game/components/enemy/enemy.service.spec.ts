import { EventEmitter2 } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { cloneDeep } from 'lodash';
import { Model } from 'mongoose';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../card/card.enum';
import { IExpeditionCurrentNodeDataEnemy } from '../expedition/expedition.interface';
import { ExpeditionService } from '../expedition/expedition.service';
import { Context } from '../interfaces';
import {
    ENEMY_CURRENT_SCRIPT_PATH,
    ENEMY_DEFENSE_PATH,
    ENEMY_HP_CURRENT_PATH,
} from './constants';
import { EnemyIntentionType } from './enemy.enum';
import { ExpeditionEnemy } from './enemy.interface';
import { Enemy, EnemyDocument } from './enemy.schema';
import { EnemyService } from './enemy.service';
import { enemySelector } from './enemy.type';

describe('EnemyService', () => {
    let enemyService: EnemyService;
    let mockCtx: Context;
    let mockEnemyModel: Model<EnemyDocument>;
    let spyOnSetHp: jest.SpyInstance;
    let spyOnSetDefense: jest.SpyInstance;

    const mockEventEmitter2 = {
        emit: jest.fn(),
    };

    const mockExpeditionService = {
        updateById: jest.fn().mockImplementation(() => Promise.resolve()),
        updateByFilter: jest.fn().mockResolvedValue(true),
    };

    const mockEnemy = {
        _id: '123',
        enemyId: 123,
        scripts: [
            {
                intentions: [
                    {
                        type: EnemyIntentionType.Attack,
                        target: CardTargetedEnum.Player,
                        value: 11,
                        effects: [
                            {
                                effect: damageEffect.name,
                                target: CardTargetedEnum.Player,
                                args: {
                                    value: 11,
                                },
                            },
                        ],
                    },
                ],
                next: [
                    {
                        probability: 0.5,
                        scriptIndex: 1,
                    },
                    {
                        probability: 0.5,
                        scriptIndex: 2,
                    },
                ],
            },
            {
                intentions: [
                    {
                        type: EnemyIntentionType.Defend,
                        target: CardTargetedEnum.Enemy,
                        value: 7,
                        effects: [
                            {
                                effect: defenseEffect.name,
                                target: CardTargetedEnum.Self,
                                args: {
                                    value: 7,
                                },
                            },
                        ],
                    },
                ],
                next: [
                    {
                        probability: 1,
                        scriptIndex: 2,
                    },
                ],
            },
            {
                intentions: [
                    {
                        type: EnemyIntentionType.Attack,
                        target: CardTargetedEnum.Player,
                        value: 4,
                        effects: [
                            {
                                effect: damageEffect.name,
                                target: CardTargetedEnum.Player,
                                args: {
                                    value: 4,
                                },
                            },
                        ],
                    },
                    {
                        type: EnemyIntentionType.Attack,
                        target: CardTargetedEnum.Player,
                        value: 2,
                        effects: [
                            {
                                effect: damageEffect.name,
                                target: CardTargetedEnum.Player,
                                args: {
                                    value: 2,
                                },
                            },
                        ],
                    },
                ],
                next: [
                    {
                        probability: 1,
                        scriptIndex: 0,
                    },
                ],
            },
        ],
    };

    let mockExpeditionEnemyA = {
        id: '1',
        enemyId: 1,
        hpMax: 10,
        hpCurrent: 10,
        defense: 5,
        statuses: {
            buff: [],
            debuff: [],
        },
        currentScript: {
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 11,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 11,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 1,
                },
                {
                    probability: 0.5,
                    scriptIndex: 2,
                },
            ],
        },
    };

    let mockExpeditionEnemyB = {
        id: '2',
        enemyId: 2,
        hpMax: 20,
        hpCurrent: 15,
        defense: 4,
        statuses: {
            buff: [],
            debuff: [],
        },
        currentScript: undefined,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(Enemy.name),
                    useValue: {
                        findById: jest.fn().mockReturnValue({
                            lean: jest.fn().mockResolvedValue(mockEnemy),
                        }),
                        findOne: jest.fn().mockReturnValue({
                            lean: jest.fn().mockResolvedValue(mockEnemy),
                        }),
                    },
                },
                {
                    provide: ExpeditionService,
                    useValue: mockExpeditionService,
                },
                EnemyService,
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter2,
                },
            ],
        }).compile();

        enemyService = module.get<EnemyService>(EnemyService);
        spyOnSetHp = jest.spyOn(enemyService, 'setHp');
        spyOnSetDefense = jest.spyOn(enemyService, 'setDefense');
        mockExpeditionService.updateByFilter.mockClear();
        mockExpeditionService.updateById.mockClear();
        mockEventEmitter2.emit.mockClear();
        mockEnemyModel = module.get(getModelToken(Enemy.name));
        mockCtx = {
            client: null,
            expedition: {
                _id: '84932',
                currentNode: {
                    data: {
                        enemies: [mockExpeditionEnemyA, mockExpeditionEnemyB],
                    },
                },
            },
        } as unknown as Context;

        mockExpeditionEnemyA = cloneDeep(mockExpeditionEnemyA);
        mockExpeditionEnemyB = cloneDeep(mockExpeditionEnemyB);
    });

    it('should be defined', () => {
        expect(enemyService).toBeDefined();
    });

    describe('isEnemy', () => {
        it('should return true if the target is an enemy', () => {
            const enemy = {
                type: CardTargetedEnum.Enemy,
            } as unknown as ExpeditionEnemy;

            expect(EnemyService.isEnemy(enemy)).toBe(true);
        });
        it('should return false if the target is not an enemy', () => {
            const enemy = {
                type: CardTargetedEnum.Player,
            } as unknown as ExpeditionEnemy;

            expect(EnemyService.isEnemy(enemy)).toBe(false);
        });
    });

    describe('isDead', () => {
        it('should return true if the enemy is dead', () => {
            const enemy = {
                value: {
                    hpCurrent: 0,
                },
            } as unknown as ExpeditionEnemy;

            expect(enemyService.isDead(enemy)).toBe(true);
        });

        it('should return false if the enemy is not dead', () => {
            const enemy = {
                value: {
                    hpCurrent: 10,
                },
            } as unknown as ExpeditionEnemy;

            expect(enemyService.isDead(enemy)).toBe(false);
        });
    });

    describe('isAllDead', () => {
        it('should return true if all enemies are dead', () => {
            const enemies = [
                {
                    hpCurrent: 0,
                } as unknown as IExpeditionCurrentNodeDataEnemy,
                {
                    hpCurrent: 0,
                } as unknown as IExpeditionCurrentNodeDataEnemy,
            ];

            mockCtx.expedition.currentNode.data.enemies = enemies;

            expect(enemyService.isAllDead(mockCtx)).toBe(true);
        });

        it('should return false if all enemies are not dead', () => {
            const enemies = [
                {
                    hpCurrent: 10,
                } as unknown as IExpeditionCurrentNodeDataEnemy,
                {
                    hpCurrent: 0,
                } as unknown as IExpeditionCurrentNodeDataEnemy,
            ];

            mockCtx.expedition.currentNode.data.enemies = enemies;

            expect(enemyService.isAllDead(mockCtx)).toBe(false);
        });
    });

    describe('findById', () => {
        it('should call find by id', async () => {
            const enemy = await enemyService.findById('123');

            expect(enemy).toEqual(mockEnemy);

            expect(mockEnemyModel.findById).toHaveBeenCalledWith('123');
        });

        it('should call find one', async () => {
            const enemy = await enemyService.findById(123);

            expect(enemy).toEqual(mockEnemy);

            expect(mockEnemyModel.findOne).toHaveBeenCalledWith({
                enemyId: 123,
            });
        });
    });

    describe('getAll', () => {
        it('should return all enemies', async () => {
            const enemies = await enemyService.getAll(mockCtx);

            expect(enemies).toEqual([
                {
                    type: CardTargetedEnum.Enemy,
                    value: mockExpeditionEnemyA,
                },
                {
                    type: CardTargetedEnum.Enemy,
                    value: mockExpeditionEnemyB,
                },
            ]);
        });
    });

    describe('get', () => {
        it('should return enemy data', async () => {
            const enemy = await enemyService.get(
                mockCtx,
                mockExpeditionEnemyA.id,
            );
            expect(enemy).toEqual({
                type: CardTargetedEnum.Enemy,
                value: mockExpeditionEnemyA,
            });
        });
    });

    describe('getRandom', () => {
        it('should return random enemy', async () => {
            const enemy = await enemyService.getRandom(mockCtx);
            expect(enemy).toHaveProperty('value.enemyId');
        });
    });

    describe('setDefense', () => {
        it('should update enemy defense', async () => {
            const enemy = enemyService.get(mockCtx, '1');

            await enemyService.setDefense(mockCtx, enemy.value.id, 5);

            expect(mockExpeditionService.updateByFilter).toHaveBeenCalledWith(
                {
                    _id: mockCtx.expedition._id,
                    ...enemySelector(enemy.value.id),
                },
                {
                    [ENEMY_DEFENSE_PATH]: 5,
                },
            );

            expect(enemy).toHaveProperty('value.defense', 5);
        });
    });

    describe('setHp', () => {
        it('should update enemy hp', async () => {
            const enemy = enemyService.get(mockCtx, '1');

            await enemyService.setHp(mockCtx, enemy.value.id, 5);

            expect(mockExpeditionService.updateByFilter).toHaveBeenCalledWith(
                {
                    _id: mockCtx.expedition._id,
                    ...enemySelector(enemy.value.id),
                },
                {
                    [ENEMY_HP_CURRENT_PATH]: 5,
                },
            );

            expect(enemy).toHaveProperty('value.hpCurrent', 5);
        });
    });

    describe('damage', () => {
        it('should invalidate defense without change the hp', async () => {
            const enemy = enemyService.get(mockCtx, '1');

            await enemyService.damage(mockCtx, enemy.value.id, 5);

            expect(spyOnSetHp).toHaveBeenCalledWith(
                mockCtx,
                enemy.value.id,
                10,
            );
            expect(spyOnSetDefense).toHaveBeenCalledWith(
                mockCtx,
                enemy.value.id,
                0,
            );

            expect(enemy).toHaveProperty('value.hpCurrent', 10);
            expect(enemy).toHaveProperty('value.defense', 0);

            expect(mockEventEmitter2.emit).toBeCalledWith(
                'entity.damage',
                expect.objectContaining({}),
            );
        });

        it('should invalidate defense and change the hp', async () => {
            const enemy = enemyService.get(mockCtx, '1');

            await enemyService.damage(mockCtx, enemy.value.id, 10);

            expect(spyOnSetHp).toHaveBeenCalledWith(mockCtx, enemy.value.id, 5);
            expect(spyOnSetDefense).toHaveBeenCalledWith(
                mockCtx,
                enemy.value.id,
                0,
            );

            expect(enemy).toHaveProperty('value.hpCurrent', 5);
            expect(enemy).toHaveProperty('value.defense', 0);

            expect(mockEventEmitter2.emit).toBeCalledWith(
                'entity.damage',
                expect.objectContaining({}),
            );
        });

        it('should invalidate defense and change the hp to 0', async () => {
            const enemy = enemyService.get(mockCtx, '1');

            await enemyService.damage(mockCtx, enemy.value.id, 20);

            expect(spyOnSetHp).toHaveBeenCalledWith(mockCtx, enemy.value.id, 0);
            expect(spyOnSetDefense).toHaveBeenCalledWith(
                mockCtx,
                enemy.value.id,
                0,
            );

            expect(enemy).toHaveProperty('value.hpCurrent', 0);
            expect(enemy).toHaveProperty('value.defense', 0);

            expect(mockEventEmitter2.emit).toBeCalledWith(
                'entity.damage',
                expect.objectContaining({}),
            );
        });
    });

    describe('calculateNewIntentions', () => {
        it('should set new intentions', async () => {
            await enemyService.calculateNewIntentions(mockCtx);

            expect(mockExpeditionService.updateByFilter).toHaveBeenCalledWith(
                {
                    _id: mockCtx.expedition._id,
                    ...enemySelector('1'),
                },
                {
                    [ENEMY_CURRENT_SCRIPT_PATH]: expect.objectContaining({
                        intentions: expect.arrayContaining([]),
                    }),
                },
            );

            expect(mockExpeditionService.updateByFilter).toHaveBeenCalledWith(
                {
                    _id: mockCtx.expedition._id,
                    ...enemySelector('2'),
                },
                {
                    [ENEMY_CURRENT_SCRIPT_PATH]: mockEnemy.scripts[0],
                },
            );
        });
    });
});
