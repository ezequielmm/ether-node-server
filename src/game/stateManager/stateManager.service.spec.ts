import { Test } from '@nestjs/testing';
import { ExpeditionStatusEnum } from '../expedition/enums';
import { StateManagerService } from './stateManager.service';
import { ExpeditionService } from '../expedition/expedition.service';

describe('StateManagerService', () => {
    let service: StateManagerService;
    const mockExpedition = {
        client_id: 'test',
        player_id: 'test',
        map: [
            {
                id: 'test',
                name: 'test',
            },
        ],
        player_state: {
            hp_current: 100,
        },
        current_node: {
            a: [0, 1, 2],
            b: [0, 1, 2],
        },
        status: ExpeditionStatusEnum.InProgress,
    };
    const mockExpeditionService: any = {
        findOne: jest.fn().mockResolvedValue(mockExpedition),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StateManagerService,
                {
                    provide: ExpeditionService,
                    useValue: mockExpeditionService,
                },
            ],
        }).compile();

        service = module.get<StateManagerService>(StateManagerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should take snapshot', async () => {
        const spyOnCreateState = jest.spyOn(service, 'createState' as never);
        await service.snapshot('test');

        expect(spyOnCreateState).toHaveBeenCalledWith('test');
        expect(mockExpeditionService.findOne).toHaveBeenCalledWith({
            client_id: 'test',
        });
        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        mockExpeditionService.findOne.mockClear();
        spyOnCreateState.mockClear();
    });

    it('should modify state (Add)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'player_state.hp_current',
            mod: 'add',
            val: 10,
        });
        const diff = service.getDiff('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    player_state: {
                        ...mockExpedition.player_state,
                        hp_current: 110,
                    },
                },
                previous: mockExpedition,
            },
        });

        expect(diff).toEqual([
            {
                kind: 'E',
                path: ['player_state', 'hp_current'],
                lhs: 100,
                rhs: 110,
            },
        ]);
    });

    it('should modify state (Sub)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'player_state.hp_current',
            mod: 'sub',
            val: 10,
        });
        const diff = service.getDiff('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    player_state: {
                        ...mockExpedition.player_state,
                        hp_current: 90,
                    },
                },
                previous: mockExpedition,
            },
        });

        expect(diff).toEqual([
            {
                kind: 'E',
                path: ['player_state', 'hp_current'],
                lhs: 100,
                rhs: 90,
            },
        ]);
    });

    it('should modify state (Ins:append)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'map',
            mod: 'ins',
            pos: 'append',
            val: {
                key: 'test',
                value: 'test',
            },
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    map: [
                        ...mockExpedition.map,
                        { key: 'test', value: 'test' },
                    ],
                },
                previous: mockExpedition,
            },
        });
    });

    it('should modify state (Ins:prepend)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'map',
            mod: 'ins',
            pos: 'prepend',
            val: {
                key: 'test',
                value: 'test',
            },
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    map: [
                        { key: 'test', value: 'test' },
                        ...mockExpedition.map,
                    ],
                },
                previous: mockExpedition,
            },
        });
    });

    it('should modify state (Rem:by prop)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'map',
            mod: 'rem',
            prop: 'id',
            val: 'test',
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    map: [],
                },
                previous: mockExpedition,
            },
        });
    });

    it('should modify state (Rem:by val)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            key: 'map',
            mod: 'rem',
            val: {
                id: 'test',
                name: 'test',
            },
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    map: [],
                },
                previous: mockExpedition,
            },
        });
    });

    it('should modify state (Mov:append)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            source: 'current_node.a',
            target: 'current_node.b',
            mod: 'mov',
            val: 2,
            pos: 'append',
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    current_node: {
                        ...mockExpedition.current_node,
                        a: [0, 1],
                        b: [0, 1, 2, 2],
                    },
                },
                previous: mockExpedition,
            },
        });
    });

    it('should modify state (Mov:prepend)', async () => {
        await service.snapshot('test');

        expect(service.stateCollection).toEqual({
            test: {
                current: mockExpedition,
                previous: mockExpedition,
            },
        });

        await service.modify('test', {
            source: 'current_node.a',
            target: 'current_node.b',
            mod: 'mov',
            val: 2,
            pos: 'prepend',
        });

        expect(service.stateCollection).toEqual({
            test: {
                current: {
                    ...mockExpedition,
                    current_node: {
                        ...mockExpedition.current_node,
                        a: [0, 1],
                        b: [2, 0, 1, 2],
                    },
                },
                previous: mockExpedition,
            },
        });
    });
});
