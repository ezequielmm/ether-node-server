import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFae1Data } from 'src/game/components/enemy/data/stingFae1.enemy';

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
                        enemies: [
                            {
                                enemies: [
                                    stingFae1Data.enemyId,
                                    stingFae1Data.enemyId,
                                ],
                                probability: 0.25,
                            },
                            {
                                enemies: [
                                    barkChargerData.enemyId,
                                    barkChargerData.enemyId,
                                ],
                                probability: 0.25,
                            },
                            {
                                enemies: [sporeMongerData.enemyId],
                                probability: 0.25,
                            },
                            {
                                enemies: [mimicFrog1Data.enemyId],
                                probability: 0.25,
                            },
                        ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 60,
                        config: {
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 30,
                        config: {
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 20,
                        config: {
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                        enemies: [
                            {
                                enemies: [1, 1], // TODO: StingFae1, StingFae2
                                probability: 0.25,
                            },
                            {
                                enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                probability: 0.25,
                            },
                            {
                                enemies: [1],
                                probability: 0.25,
                            },
                            {
                                enemies: [1], // TODO: MimicFrog (1 or 2)
                                probability: 0.25,
                            },
                        ],
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
                            enemies: [12],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
                            enemies: [
                                {
                                    enemies: [1, 1], // TODO: StingFae1, StingFae2
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1, 1], // TODO: BarkCharger, BarkCharger
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1],
                                    probability: 0.25,
                                },
                                {
                                    enemies: [1], // TODO: MimicFrog (1 or 2)
                                    probability: 0.25,
                                },
                            ],
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
