import { IActConfiguration } from './mapBuilder.interface';
import { NodeType } from '../../components/expedition/node-type';

// import relevant enemy data
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from '../../components/enemy/data/stingFae.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { treantData } from 'src/game/components/enemy/data/treant.enemy';
import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';

const ActOneNodeProbabilities = [
        {
            key: "Merchant",
            probability: 5,
        },
        {
            key: "Camp",
            probability: 12,
        },
        {
            key: "Treasure",
            probability: 15,
        },
];

const ActOneNodeCombatProbabilities = [
    {
        key: "EliteCombat",
        probability: 8,
        nodeConfig: {
            healthMultiplier: 1
        }
    },
    {
        key: "StandardCombat",
        probability: 50,
        nodeConfig: {
            healthMultiplier: 1
        }
    }
];

const ActOneNodeDifficultCombatProbabilities = [
    {
        key: "EliteCombat",
        probability: 8,
        nodeConfig: {
            healthMultiplier: 1.5
        }
    },
    {
        key: "StandardCombat",
        probability: 50,
        nodeConfig: {
            healthMultiplier: 1.5
        }
    }
];

const ActOneConfig: IActConfiguration = {
    actNumber: 1,

    stepCount: 22,
    maxNodesPerStep: 6,

    stepRangeConfig: {
        'DEFAULT': {
            minNodes: 3,
            maxNodes: 5,
            nodeOptions: [
                {
                    key: "InitialCombat",
                    probability: 100,
                }
            ]
        },
        'STEP-3': { 
            minNodes: 2,
            maxNodes: 4,
            nodeOptions: [
                ...ActOneNodeProbabilities,
                ...ActOneNodeCombatProbabilities,
                {
                    key: "Encounter",
                    probability: 20,
                    maxStepsInRange: 2,
                },
            ]
        },
        'STEP-11': {
            minNodes: 3,
            maxNodes: 5,
            nodeOptions: [
                {
                    key: "EliteCombat",
                    probability: 100,
                }
            ],
        },
        'STEP-12': {
            minNodes: 3,
            maxNodes: 5,
            nodeOptions: [
                {
                    key: "Camp",
                    probability: 100,
                }
            ],
        },
        'STEP-13': {
            minNodes: 2,
            maxNodes: 4,
            nodeOptions: [
                ...ActOneNodeProbabilities,
                ...ActOneNodeDifficultCombatProbabilities,
                {
                    key: "Encounter",
                    probability: 20,
                    maxStepsInRange: 2,
                },
            ]
        },
        'STEP-20': {
            minNodes: 1,
            maxNodes: 1,
            nodeOptions: [
                {
                    key: "Camp",
                    probability: 100,
                }
            ],
        },
        'FINAL': {
            minNodes: 1,
            maxNodes: 1,
            nodeOptions: [
                {
                    key: "BossCombat",
                    probability: 100,
                }
            ]
        },
    },
    
    nodeOptions: {
        'Camp': [
            {
                type: NodeType.Camp,
                subType: NodeType.CampRegular,
                title: 'Spirit Well',
                nodeConfig: {},
                probability: 100,
            }
        ],
        'Merchant': [
            {
                type: NodeType.Merchant,
                subType: NodeType.Merchant,
                title: 'Merchant',
                nodeConfig: {},
                probability: 100,
            }
        ],
        'Treasure': [
            {
                type: NodeType.Treasure,
                subType: NodeType.Treasure,
                title: 'Treasure',
                nodeConfig: {},
                probability: 100,
            }
        ],
        'Encounter': [
            {
                type: NodeType.Encounter,
                subType: NodeType.Encounter,
                title: 'Encounter',
                nodeConfig: {},
                probability: 100,
            }
        ],
        'InitialCombat': [
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [stingFaeData.enemyId, stingFaeData.enemyId],
                },
                probability: 25,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [barkChargerData.enemyId, barkChargerData.enemyId],
                },
                probability: 25,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [sporeMongerData.enemyId],
                },
                probability: 25,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [mimicFrog1Data.enemyId],
                },
                probability: 25,
            }
        ],
        'StandardCombat': [
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [mimicFrog1Data.enemyId, mimicFrog1Data.enemyId]
                },
                probability: 12
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [groundMothData.enemyId]
                },
                probability: 11,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        swampGoblin1Data.enemyId,
                    ],
                },
                probability: 11,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        barkChargerData.enemyId,
                        barkChargerData.enemyId,
                        barkChargerData.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        swampGoblin2Data.enemyId,
                        swampGoblin2Data.enemyId,
                        swampGoblin1Data.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [barkChargerData.enemyId, swampGoblin2Data.enemyId],
                },
                probability: 9,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                    ],
                },
                probability: 9,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        stingFaeData.enemyId,
                        groundMothData.enemyId,
                        stingFaeData.enemyId,
                    ],
                },
                probability: 8,
            },
        ],
        'DifficultCombat': [
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        mimicFrog1Data.enemyId,
                        mimicFrog1Data.enemyId,
                        sporeMongerData.enemyId,
                    ],
                },
                probability: 12,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        groundMothData.enemyId, 
                        sporeMongerData.enemyId
                    ],
                },
                probability: 11,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        barkChargerData.enemyId,
                        barkChargerData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                    ],
                },
                probability: 11,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        swampGoblin1Data.enemyId,
                        swampGoblin2Data.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        swampGoblin1Data.enemyId,
                        swampGoblin2Data.enemyId,
                        swampGoblin1Data.enemyId,
                        swampGoblin2Data.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        sporeMongerData.enemyId,
                        sporeMongerData.enemyId,
                        stingFaeData.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        swampGoblin1Data.enemyId,
                        swampGoblin2Data.enemyId,
                        mimicFrog1Data.enemyId,
                    ],
                },
                probability: 10,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        barkChargerData.enemyId,
                        barkChargerData.enemyId,
                        swampGoblin2Data.enemyId,
                    ],
                },
                probability: 9,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                        stingFaeData.enemyId,
                    ],
                },
                probability: 9,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
                title: "Combat",
                nodeConfig: {
                    enemies: [groundMothData.enemyId, groundMothData.enemyId],
                },
                probability: 8,
            },
        ],
        'EliteCombat': [
            {
                type: NodeType.Combat,
                subType: NodeType.CombatElite,
                title: "Elite Combat",
                nodeConfig: {
                    enemies: [thornWolfData.enemyId],
                },
                probability: 33.3,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatElite,
                title: "Elite Combat",
                nodeConfig: {
                    enemies: [queenOrchidData.enemyId],
                },
                probability: 33.3,
            },
            {
                type: NodeType.Combat,
                subType: NodeType.CombatElite,
                title: "Elite Combat",
                nodeConfig: {
                    enemies: [ancientOneData.enemyId],
                },
                probability: 33.3,
            },
        ],
        'BossCombat': [
            { 
                type: NodeType.Combat,
                subType: NodeType.CombatBoss,
                title: 'Boss: Treant',
                nodeConfig: {
                    enemies: [treantData.enemyId],
                },
                probability: 0.5,
            },
            { 
                type: NodeType.Combat,
                subType: NodeType.CombatBoss,
                title: 'Boss: Fungal Brute',
                nodeConfig: {
                    enemies: [fungalBruteData.enemyId],
                },
                probability: 0.5,
            },
        ],
    },
};

export { ActOneConfig };