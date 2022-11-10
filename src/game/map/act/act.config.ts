import * as _ from 'lodash';
import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { trapelicanData } from 'src/game/components/enemy/data/trapelican.enemy';
import { treantData } from 'src/game/components/enemy/data/treant.enemy';

export const actDefaults = {
    stepsTotal: 21,
    minNodesPerStep: 2,
    maxNodesPerStep: 6,
    minExitPerNode: 1,
    maxExitPerNode: 3,
};

export const actCconfigAlternatives = [
    {
        act: 1,
        steps: 21,
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
                    chance: 70,
                    config: {
                        enemies: [
                            {
                                enemies: [
                                    stingFaeData.enemyId,
                                    stingFaeData.enemyId,
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
                    type: 'camp',
                    subType: 'camp_regular',
                    chance: 10,
                    config: {},
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
        step_config: [
            // Node 1
            {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 70,
                        config: {
                            enemies: [
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
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
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 30,
                        config: {},
                    },
                ],
            },
            // Node 2
            {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 70,
                        config: {
                            enemies: [
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
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
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 30,
                        config: {},
                    },
                ],
            },
            // Node 3
            {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 40,
                        config: {
                            enemies: [
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
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
                ],
            },
            // Node 4 to 11
            ..._.range(8).map(() => ({
                nodes: [2, 4],
                node_options: [
                    {
                        type: 'merchant',
                        subType: 'merchant',
                        chance: 5,
                        config: {},
                    },

                    {
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 12,
                        config: {},
                    },

                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 8,
                        config: {
                            enemies: [
                                {
                                    enemies: [thornWolfData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [queenOrchidData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [ancientOneData.enemyId],
                                    probability: 33.3,
                                },
                            ],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 75,
                        config: {
                            enemies: [
                                {
                                    enemies: [
                                        mimicFrog1Data.enemyId,
                                        mimicFrog1Data.enemyId,
                                    ], // TODO: Mimic Frog 2
                                    probability: 0.12,
                                },
                                {
                                    enemies: [groundMothData.enemyId],
                                    probability: 0.11,
                                },
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        swampGoblin1Data.enemyId,
                                    ],
                                    probability: 0.11,
                                },
                                {
                                    enemies: [
                                        barkChargerData.enemyId,
                                        barkChargerData.enemyId,
                                        barkChargerData.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        swampGoblin2Data.enemyId,
                                        swampGoblin2Data.enemyId,
                                        swampGoblin1Data.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        sporeMongerData.enemyId,
                                        trapelicanData.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        trapelicanData.enemyId,
                                        mimicFrog1Data.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        barkChargerData.enemyId,
                                        swampGoblin2Data.enemyId,
                                    ],
                                    probability: 0.09,
                                },
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                    ],
                                    probability: 0.09,
                                },
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        groundMothData.enemyId,
                                        stingFaeData.enemyId,
                                    ],
                                    probability: 0.08,
                                },
                            ],
                        },
                    },
                ],
            })),
            // Node 12
            {
                nodes: [3, 5],
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 100,
                        config: {
                            enemies: [
                                {
                                    enemies: [thornWolfData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [queenOrchidData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [ancientOneData.enemyId],
                                    probability: 33.3,
                                },
                            ],
                        },
                    },
                ],
            },
            {
                nodes: 1,
                node_options: [
                    {
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 100,
                        config: {},
                    },
                ],
            },
            // Node 14 to 20
            ..._.range(7).map(() => ({
                nodes: [2, 4],
                node_options: [
                    {
                        type: 'merchant',
                        subType: 'merchant',
                        chance: 5,
                        config: {},
                    },

                    {
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 12,
                        config: {},
                    },

                    {
                        type: 'combat',
                        subType: 'combat_elite',
                        chance: 8,
                        config: {
                            enemies: [
                                {
                                    enemies: [thornWolfData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [queenOrchidData.enemyId],
                                    probability: 33.3,
                                },
                                {
                                    enemies: [ancientOneData.enemyId],
                                    probability: 33.3,
                                },
                            ],
                        },
                    },
                    {
                        type: 'combat',
                        subType: 'combat_standard',
                        chance: 75,
                        config: {
                            enemies: [
                                {
                                    enemies: [
                                        mimicFrog1Data.enemyId,
                                        mimicFrog1Data.enemyId,
                                        sporeMongerData.enemyId,
                                    ],
                                    probability: 0.12,
                                },
                                {
                                    enemies: [
                                        groundMothData.enemyId,
                                        sporeMongerData.enemyId,
                                    ],
                                    probability: 0.11,
                                },
                                {
                                    enemies: [
                                        barkChargerData.enemyId,
                                        barkChargerData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                    ],
                                    probability: 0.11,
                                },
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        swampGoblin1Data.enemyId,
                                        swampGoblin2Data.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        swampGoblin2Data.enemyId,
                                        swampGoblin2Data.enemyId,
                                        swampGoblin1Data.enemyId,
                                        swampGoblin1Data.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        sporeMongerData.enemyId,
                                        sporeMongerData.enemyId,
                                        trapelicanData.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        trapelicanData.enemyId,
                                        trapelicanData.enemyId,
                                        mimicFrog1Data.enemyId,
                                    ],
                                    probability: 0.1,
                                },
                                {
                                    enemies: [
                                        barkChargerData.enemyId,
                                        barkChargerData.enemyId,
                                        swampGoblin2Data.enemyId,
                                    ],
                                    probability: 0.09,
                                },
                                {
                                    enemies: [
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                        stingFaeData.enemyId,
                                    ],
                                    probability: 0.09,
                                },
                                {
                                    enemies: [
                                        groundMothData.enemyId,
                                        groundMothData.enemyId,
                                    ],
                                    probability: 0.08,
                                },
                            ],
                        },
                    },
                ],
            })),
            // Node 21
            {
                nodes: 1,
                node_options: [
                    {
                        type: 'camp',
                        subType: 'camp_regular',
                        chance: 100,
                        config: {},
                    },
                ],
            },
            // Node 22
            {
                nodes: 1,
                node_options: [
                    {
                        type: 'combat',
                        subType: 'combat_boss',
                        chance: 100,
                        config: {
                            enemies: [
                                {
                                    enemies: [treantData.enemyId],
                                    probability: 0.5,
                                },
                                {
                                    enemies: [fungalBruteData.enemyId],
                                    probability: 0.5,
                                },
                            ],
                        },
                        map_data: {
                            icon: 'combat_boss_act1boss1',
                        },
                    },
                ],
            },
        ],
    },
];
