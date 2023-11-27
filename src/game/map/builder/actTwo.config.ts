import { IActConfiguration } from './mapBuilder.interface';
import { NodeType } from '../../components/expedition/node-type';

// import relevant enemy data
//- Basic:
import { caveGoblinData } from 'src/game/components/enemy/data/caveGoblin.enemy';
import { centipionData } from 'src/game/components/enemy/data/centipion.enemy';
import { deepGoblinData } from 'src/game/components/enemy/data/deepGoblin.enemy';
import { mossySkeletonData } from 'src/game/components/enemy/data/mossySkeleton.enemy';
import { mossyArcherData } from 'src/game/components/enemy/data/mossyArcher.enemy';
import { mossyBonesData } from 'src/game/components/enemy/data/mossyBones.enemy';
import { moldPolypData } from 'src/game/components/enemy/data/moldPolyp.enemy';
import { caveHomunculiData } from 'src/game/components/enemy/data/caveHomunculi.enemy';
import { mimicData } from 'src/game/components/enemy/data/mimic.enemy';

//- Elite:
import { trollData } from 'src/game/components/enemy/data/troll.enemy';
import { deepSorcererGreenData } from 'src/game/components/enemy/data/deepSorcererGreen.enemy';

//- Bosses:
import { swarmMasterData } from 'src/game/components/enemy/data/swarmMaster.enemy';
import { deepDwellerLureData } from 'src/game/components/enemy/data/deepDwellerLure.enemy';


const ActTwoNodeProbabilities = [
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

const ActTwoNodeCombatProbabilities = [
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

const ActTwoNodeDifficultCombatProbabilities = [
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

const nodeOptions = {
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
                enemies: [caveGoblinData.enemyId, caveGoblinData.enemyId],
            },
            probability: 25,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [centipionData.enemyId, centipionData.enemyId],
            },
            probability: 25,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [mimicData.enemyId],
            },
            probability: 25,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [caveGoblinData.enemyId],
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
                enemies: [caveHomunculiData.enemyId]
            },
            probability: 12
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [caveGoblinData.enemyId, mossyArcherData.enemyId]
            },
            probability: 11,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [
                    caveGoblinData.enemyId,
                    centipionData.enemyId,
                    caveGoblinData.enemyId,
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
                    deepGoblinData.enemyId,
                    centipionData.enemyId
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
                    caveHomunculiData.enemyId,
                    caveGoblinData.enemyId
                ],
            },
            probability: 10,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [mossySkeletonData.enemyId, mossyArcherData.enemyId],
            },
            probability: 9,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [
                    moldPolypData.enemyId,
                    moldPolypData.enemyId,
                    moldPolypData.enemyId
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
                    moldPolypData.enemyId,
                    mossySkeletonData.enemyId,
                    centipionData.enemyId,
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
                    caveHomunculiData.enemyId,
                    caveGoblinData.enemyId,
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
                    caveGoblinData.enemyId, 
                    mossyArcherData.enemyId,
                    moldPolypData.enemyId
                ]
            },
            probability: 11,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            title: "Combat",
            nodeConfig: {
                enemies: [
                    caveGoblinData.enemyId,
                    centipionData.enemyId,
                    caveGoblinData.enemyId,
                    mossyArcherData.enemyId
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
                    deepGoblinData.enemyId,
                    centipionData.enemyId,
                    moldPolypData.enemyId
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
                    caveHomunculiData.enemyId,
                    caveGoblinData.enemyId,
                    centipionData.enemyId,
                    centipionData.enemyId
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
                    mossySkeletonData.enemyId, 
                    mossyArcherData.enemyId, 
                    mossyBonesData.enemyId
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
                    moldPolypData.enemyId,
                    moldPolypData.enemyId,
                    moldPolypData.enemyId,
                    deepGoblinData.enemyId

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
                    moldPolypData.enemyId,
                    mossySkeletonData.enemyId,
                    centipionData.enemyId,
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
                    deepGoblinData.enemyId,
                    deepGoblinData.enemyId
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
                    caveHomunculiData.enemyId, 
                    caveHomunculiData.enemyId
                ],
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
                enemies: [trollData.enemyId],
            },
            probability: 50,
        },
        {
            type: NodeType.Combat,
            subType: NodeType.CombatElite,
            title: "Elite Combat",
            nodeConfig: {
                enemies: [deepSorcererGreenData.enemyId],
            },
            probability: 50,
        },
    ],
    'BossCombat': [
        { 
            type: NodeType.Combat,
            subType: NodeType.CombatBoss,
            title: 'Boss: Swarm Master',
            nodeConfig: {
                enemies: [swarmMasterData.enemyId],
            },
            probability: 0.5,
        },
        { 
            type: NodeType.Combat,
            subType: NodeType.CombatBoss,
            title: 'Boss: Deep Dweller Lure',
            nodeConfig: {
                enemies: [deepDwellerLureData.enemyId],
            },
            probability: 0.5,
        },
    ],
};

const createStage2NewMap = (maxStepsVar: number, maxNodesVar: number): IActConfiguration => {
    if(maxStepsVar >= 12){
        return createMoreOrEquals12NodesMap(maxStepsVar, maxNodesVar);
    } 
    if(maxStepsVar < 12 && maxStepsVar >= 5){
        return createLess12NodesMap(maxStepsVar, maxNodesVar)
    }
    else{
        return createLess5NodesMap(maxStepsVar, maxNodesVar)
    }
}

const createMoreOrEquals12NodesMap = (maxStepsVar: number, maxNodesVar: number): IActConfiguration => {

    let maxSteps = maxStepsVar <= 30 ? maxStepsVar : 30;
    let maxNodes = maxNodesVar <= 5 ? maxNodesVar : 5;
    const halfWay     = Math.floor(maxSteps / 2) -1;
    const quarterWay  = Math.floor(halfWay / 2);
    const onePlusHalf = 1 + halfWay;
    const twoPlusHalf = 2 + halfWay;
    const beforeBoss  = maxSteps - 2;
    const beforeCamp  = maxSteps - 3;

    return {
        
        actNumber: 2,
        stepCount: maxSteps,
        maxNodesPerStep: maxNodes,
        nodeOptions: nodeOptions,
        stepRangeConfig: {
            'DEFAULT': {
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    {
                        key: "InitialCombat",
                        probability: 100,
                    }
                ]
            },
            [`STEP-${quarterWay}`]: { 
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    ...ActTwoNodeProbabilities,
                    ...ActTwoNodeCombatProbabilities,
                    {
                        key: "Encounter",
                        probability: 20,
                        maxStepsInRange: 2,
                    },
                ]
            },
            [`STEP-${halfWay}`]: {
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    {
                        key: "EliteCombat",
                        probability: 100,
                    }
                ],
            },
            [`STEP-${onePlusHalf}`]: {
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    {
                        key: "Camp",
                        probability: 100,
                    }
                ],
            },
            [`STEP-${twoPlusHalf}`]: {
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    ...ActTwoNodeProbabilities,
                    ...ActTwoNodeDifficultCombatProbabilities,
                    {
                        key: "Encounter",
                        probability: 20,
                        maxStepsInRange: 2,
                    },
                ]
            },
            [`STEP-${beforeCamp}`]: {
                minNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                maxNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                funnel: true,
                nodeOptions: [
                    {
                        key: "DifficultCombat",
                        probability: 100,
                    }
                ],
            },
            [`STEP-${beforeBoss}`]: {
                minNodes: 1,
                maxNodes: 1,
                prevBoss: true,
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
                boss: true,
                nodeOptions: [
                    {
                        key: "BossCombat",
                        probability: 100,
                    }
                ]
            },
        },
    }
};

const createLess5NodesMap = (maxStepsVar: number, maxNodesVar:number): IActConfiguration => {
    let maxSteps = maxStepsVar >= 1 ? maxStepsVar : 1;
    let maxNodes = maxNodesVar <= 5 ? maxNodesVar : 5;

    if(maxSteps == 1){
        return{
            actNumber: 2,
            stepCount: 1,
            maxNodesPerStep: 1, // will be 1 anyway
            nodeOptions: nodeOptions,
            stepRangeConfig: {
                'FINAL': {
                    minNodes: 1,
                    maxNodes: 1,
                    boss: true,
                    nodeOptions: [
                        {
                            key: "BossCombat",
                            probability: 100,
                        }
                    ]
                },
            },
        }
    }else if(maxSteps == 2){
        maxNodes = maxNodes <= 3 ? maxNodes : 3;
        return {
            actNumber: 2,
            stepCount: maxSteps,
            maxNodesPerStep: maxNodes,
            nodeOptions: nodeOptions,
            stepRangeConfig: {
                'DEFAULT': {
                    minNodes: maxNodes,
                    maxNodes: maxNodes,
                    nodeOptions: [
                        {
                            key: "InitialCombat",
                            probability: 100,
                        }
                    ]
                },
                'FINAL': {
                    minNodes: 1,
                    maxNodes: 1,
                    boss: true,
                    nodeOptions: [
                        {
                            key: "BossCombat",
                            probability: 100,
                        }
                    ]
                },
            }
        }
    }
    else{
        //- More than 2 step, less than 5:
        const beforeBoss  = maxSteps - 2;
        return {
            actNumber: 2,
            stepCount: maxSteps,
            maxNodesPerStep: maxNodes,
            nodeOptions: nodeOptions,
            stepRangeConfig: {
                'DEFAULT': {
                    minNodes: maxNodes,
                    maxNodes: maxNodes,
                    nodeOptions: [
                        {
                            key: "InitialCombat",
                            probability: 100,
                        }
                    ]
                },
                [`STEP-${beforeBoss}`]: {
                    minNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                    maxNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                    funnel: true,
                    nodeOptions: [
                        {
                            key: "DifficultCombat",
                            probability: 100,
                        }
                    ],
                },
                'FINAL': {
                    minNodes: 1,
                    maxNodes: 1,
                    boss: true,
                    nodeOptions: [
                        {
                            key: "BossCombat",
                            probability: 100,
                        }
                    ]
                },
            }
        }
    }
}

const createLess12NodesMap = (maxStepsVar: number, maxNodesVar:number): IActConfiguration => {
    let maxSteps = maxStepsVar >= 5 ? maxStepsVar : 5;
    let maxNodes = maxNodesVar <= 5 ? maxNodesVar : 5;
    const beforeBoss  = maxSteps - 2;
    const beforeCamp  = maxSteps - 3;

    return {
        
        actNumber: 2,
        stepCount: maxSteps,
        maxNodesPerStep: maxNodes,
        nodeOptions: nodeOptions,
        stepRangeConfig: {
            'DEFAULT': {
                minNodes: maxNodes,
                maxNodes: maxNodes,
                nodeOptions: [
                    {
                        key: "InitialCombat",
                        probability: 100,
                    }
                ]
            },
            [`STEP-${beforeCamp}`]: {
                minNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                maxNodes: maxNodes > 2 ? 3 : (maxNodes > 1 ? 2 : 1),
                funnel: true,
                nodeOptions: [
                    {
                        key: "DifficultCombat",
                        probability: 100,
                    }
                ],
            },
            [`STEP-${beforeBoss}`]: {
                minNodes: 1,
                maxNodes: 1,
                prevBoss: true,
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
                boss: true,
                nodeOptions: [
                    {
                        key: "BossCombat",
                        probability: 100,
                    }
                ]
            },
        },
    }
}


export { createStage2NewMap };