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
        steps: 12,
        minNodesPerStep: 2,
        maxNodesPerStep: 4,
        minExitPerNode: 1,
        maxExitPerNode: 3,
        step_defaults: {
            nodes: [2, 6],
            node_options: [
                {
                    type: 'combat',
                    subType: 'combat_standard',
                    chance: 80,
                    config: {
                        enemies: [9, 2, 1, 7],
                    },
                },
                {
                    type: 'encounter',
                    subType: 'encounter',
                    chance: 19,
                    config: {},
                },
                {
                    type: 'merchant',
                    subType: 'merchant',
                    chance: 1,
                    config: {},
                },
            ],
        },
        step_config: {
            0: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            1: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            2: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            3: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 60,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            4: {
                nodes: [2, 4],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 70,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 30,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                ],
            },
            5: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 30,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 20,
                        config: {
                            enemies: ['elite2', 'elite2'],
                        },
                    },
                    {
                        type: 'encounter',
                        subType: 'encounter',
                        chance: 40,
                        config: {},
                    },
                    {
                        type: 'merchant',
                        subType: 'merchant',
                        chance: 10,
                        config: {},
                    },
                ],
            },
            6: {
                nodes: 2,
                node_options: [
                    {
                        type: 'merchant',
                        subType: 'merchant',
                        chance: 80,
                        config: {},
                    },
                    {
                        type: 'merchant',
                        subType: 'merchant',
                        chance: 20,
                        config: {},
                    },
                ],
            },
            7: {
                nodes: [3, 4],
                node_options: [
                    {
                        type: 'treasure',
                        subType: 'treasure',
                        chance: 30,
                        config: {},
                    },
                    {
                        type: 'treasure',
                        subType: 'treasure',
                        chance: 70,
                        config: {},
                    },
                ],
            },
            12: {
                nodes: 1,
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_boss',
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
        steps: 13,
        minNodesPerStep: 2,
        maxNodesPerStep: 4,
        minExitPerNode: 2,
        maxExitPerNode: 3,
        step_defaults: {
            nodes: [2, 6],
            node_options: [
                {
                    type: 'combat',
                    subType: 'combat_standard',
                    chance: 80,
                    config: {
                        enemies: [9, 2, 1, 7],
                    },
                },
                {
                    type: 'encounter',
                    subType: 'encounter',
                    chance: 19,
                    config: {},
                },
                {
                    type: 'merchant',
                    subType: 'merchant',
                    chance: 1,
                    config: {},
                },
            ],
        },
        step_config: {
            0: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            1: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            2: {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [9, 2, 1, 7],
                        },
                    },
                ],
            },
            12: {
                nodes: 1,
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_boss',
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
