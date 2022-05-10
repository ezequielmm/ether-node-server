export const actDefaults = {
    stepsTotal: 20,
    minNodesPerStep: 2,
    maxNodesPerStep: 6,
    minExitPerNode: 1,
    maxExitPerNode: 3,
};
export const actCconfigAlternatives = [
    {
        act: 1,
        steps: 3,
        minNodesPerStep: 2,
        maxNodesPerStep: 4,
        minExitPerNode: 1,
        maxExitPerNode: 3,
        step_defaults: {
            nodes: [2, 6],
            node_options: [
                {
                    type: 'combat_standard',
                    chance: 80,
                    config: {
                        enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                    },
                },
                {
                    type: 'encounter',
                    chance: 19,
                    config: {},
                },
                {
                    type: 'merchant',
                    chance: 1,
                    config: {},
                },
            ],
        },
        step_config: {
            0: {
                nodes: [3, 5],
            },
            4: {
                nodes: 3,
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 100,
                        config: {},
                    },
                ],
            },
            6: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 60,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            10: {
                nodes: [2, 4],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 70,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 30,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            11: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 30,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 20,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                    {
                        type: 'encounter',
                        chance: 40,
                        config: {},
                    },
                    {
                        type: 'merchant',
                        chance: 10,
                        config: {},
                    },
                ],
            },
            12: {
                nodes: 2,
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 80,
                        config: {},
                    },
                    {
                        type: 'camp_house',
                        chance: 20,
                        config: {
                            house: [1, 2, 3, 4],
                        },
                    },
                ],
            },
            19: {
                nodes: [3, 4],
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 30,
                        config: {},
                    },
                    {
                        type: 'camp_house',
                        chance: 70,
                        config: {
                            house: [1, 2, 3, 4],
                        },
                    },
                ],
            },
            20: {
                nodes: 1,
                node_options: [
                    {
                        type: 'combat_boss',
                        chance: 100,
                        config: {
                            enemies: ['boss_1'],
                        },
                        map_data: {
                            icon: 'combat_boss_act1boss1',
                        },
                    },
                ],
            },
        },
    },
    {
        act: 2,
        steps: 3,
        minNodesPerStep: 2,
        maxNodesPerStep: 4,
        minExitPerNode: 1,
        maxExitPerNode: 3,
        step_defaults: {
            nodes: [2, 6],
            node_options: [
                {
                    type: 'combat_standard',
                    chance: 80,
                    config: {
                        enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                    },
                },
                {
                    type: 'encounter',
                    chance: 19,
                    config: {},
                },
                {
                    type: 'merchant',
                    chance: 1,
                    config: {},
                },
            ],
        },
        step_config: {
            0: {
                nodes: [3, 5],
            },
            4: {
                nodes: 3,
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 100,
                        config: {},
                    },
                ],
            },
            6: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 60,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            10: {
                nodes: [2, 4],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 70,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 30,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            11: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat_standard',
                        chance: 30,
                        config: {
                            enemies: ['enemy1', 'enemy2', 'enemy3', 'enemy4'],
                        },
                    },
                    {
                        type: 'combat_elite',
                        chance: 20,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                    {
                        type: 'encounter',
                        chance: 40,
                        config: {},
                    },
                    {
                        type: 'merchant',
                        chance: 10,
                        config: {},
                    },
                ],
            },
            12: {
                nodes: 2,
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 80,
                        config: {},
                    },
                    {
                        type: 'camp_house',
                        chance: 20,
                        config: {
                            house: [1, 2, 3, 4],
                        },
                    },
                ],
            },
            19: {
                nodes: [3, 4],
                node_options: [
                    {
                        type: 'camp_regular',
                        chance: 30,
                        config: {},
                    },
                    {
                        type: 'camp_house',
                        chance: 70,
                        config: {
                            house: [1, 2, 3, 4],
                        },
                    },
                ],
            },
            20: {
                nodes: 1,
                node_options: [
                    {
                        type: 'combat_boss',
                        chance: 100,
                        config: {
                            enemies: ['boss_1'],
                        },
                        map_data: {
                            icon: 'combat_boss_act1boss1',
                        },
                    },
                ],
            },
        },
    },
];
