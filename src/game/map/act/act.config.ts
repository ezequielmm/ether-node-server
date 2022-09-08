import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFae1Data } from 'src/game/components/enemy/data/stingFae1.enemy';
import { stingFae2Data } from 'src/game/components/enemy/data/stingFae2.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { trapelicanData } from 'src/game/components/enemy/data/trapelican.enemy';
import { treantData } from 'src/game/components/enemy/data/treant.enemy';

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
                // {
                //     type: 'combat',
                //     subType: 'combat_standard',
                //     chance: 70,
                //     config: {
                //         enemies: [
                //             {
                //                 enemies: [
                //                     stingFae1Data.enemyId,
                //                     stingFae1Data.enemyId,
                //                 ],
                //                 probability: 0.25,
                //             },
                //             {
                //                 enemies: [
                //                     barkChargerData.enemyId,
                //                     barkChargerData.enemyId,
                //                 ],
                //                 probability: 0.25,
                //             },
                //             {
                //                 enemies: [sporeMongerData.enemyId],
                //                 probability: 0.25,
                //             },
                //             {
                //                 enemies: [mimicFrog1Data.enemyId],
                //                 probability: 0.25,
                //             },
                //         ],
                //     },
                // },
                {
                    type: 'camp',
                    subType: 'camp_regular',
                    chance: 10,
                    config: {},
                },
                {
                    type: 'encounter',
                    subType: 'encounter',
                    chance: 15,
                    config: {},
                },
                {
                    type: 'merchant',
                    subType: 'merchant',
                    chance: 5,
                    config: {},
                },
            ],
        },
        step_config: {
            // 0: {
            //     nodes: [3, 5],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 40,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [sporeMongerData.enemyId],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [mimicFrog1Data.enemyId],
            //                         probability: 0.25,
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // 1: {
            //     nodes: [3, 5],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 40,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [sporeMongerData.enemyId],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [mimicFrog1Data.enemyId],
            //                         probability: 0.25,
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // 2: {
            //     nodes: [3, 5],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 40,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [sporeMongerData.enemyId],
            //                         probability: 0.25,
            //                     },
            //                     {
            //                         enemies: [mimicFrog1Data.enemyId],
            //                         probability: 0.25,
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // 3: {
            //     nodes: [3, 5],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 40,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             mimicFrog1Data.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ], // TODO: Mimic Frog 2
            //                         probability: 0.12,
            //                     },
            //                     {
            //                         enemies: [groundMothData.enemyId],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             sporeMongerData.enemyId,
            //                             trapelicanData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             trapelicanData.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             groundMothData.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.08,
            //                     },
            //                 ],
            //             },
            //         },
            //         {
            //             type: 'combat',
            //             subType: 'combat_elite',
            //             chance: 60,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [thornWolfData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [queenOrchidData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [ancientOneData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // 4: {
            //     nodes: [2, 4],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 70,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             mimicFrog1Data.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ], // TODO: Mimic Frog 2
            //                         probability: 0.12,
            //                     },
            //                     {
            //                         enemies: [groundMothData.enemyId],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             sporeMongerData.enemyId,
            //                             trapelicanData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             trapelicanData.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             groundMothData.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.08,
            //                     },
            //                 ],
            //             },
            //         },
            //         {
            //             type: 'combat',
            //             subType: 'combat_elite',
            //             chance: 30,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [thornWolfData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [queenOrchidData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [ancientOneData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // 5: {
            //     nodes: [3, 5],
            //     node_options: [
            //         {
            //             type: 'combat',
            //             subType: 'combat_standard',
            //             chance: 30,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [
            //                             mimicFrog1Data.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ], // TODO: Mimic Frog 2
            //                         probability: 0.12,
            //                     },
            //                     {
            //                         enemies: [groundMothData.enemyId],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.11,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                             barkChargerData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                             swampGoblin1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             sporeMongerData.enemyId,
            //                             trapelicanData.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             trapelicanData.enemyId,
            //                             mimicFrog1Data.enemyId,
            //                         ],
            //                         probability: 0.1,
            //                     },
            //                     {
            //                         enemies: [
            //                             barkChargerData.enemyId,
            //                             swampGoblin2Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                             stingFae1Data.enemyId,
            //                         ],
            //                         probability: 0.09,
            //                     },
            //                     {
            //                         enemies: [
            //                             stingFae1Data.enemyId,
            //                             groundMothData.enemyId,
            //                             stingFae2Data.enemyId,
            //                         ],
            //                         probability: 0.08,
            //                     },
            //                 ],
            //             },
            //         },
            //         {
            //             type: 'combat',
            //             subType: 'combat_elite',
            //             chance: 20,
            //             config: {
            //                 enemies: [
            //                     {
            //                         enemies: [thornWolfData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [queenOrchidData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                     {
            //                         enemies: [ancientOneData.enemyId],
            //                         probability: 33.3,
            //                     },
            //                 ],
            //             },
            //         },
            //         {
            //             type: 'encounter',
            //             subType: 'encounter',
            //             chance: 40,
            //             config: {},
            //         },
            //         {
            //             type: 'merchant',
            //             subType: 'merchant',
            //             chance: 10,
            //             config: {},
            //         },
            //     ],
            // },
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
        },
    },
];
