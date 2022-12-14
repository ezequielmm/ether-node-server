import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { treantData } from 'src/game/components/enemy/data/treant.enemy';
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { DefaultActBuilder, NodeConfig } from './act.builder';
import { DefaultNodeDataFiller } from './node-data-generator';
import { NodeTypePool } from './node-type-pool';

const basicInitialCombatNode: NodeConfig = {
    type: ExpeditionMapNodeTypeEnum.Combat,
    subType: ExpeditionMapNodeTypeEnum.CombatStandard,
    data: {
        enemies: [
            {
                enemies: [stingFaeData.enemyId, stingFaeData.enemyId],
                probability: 0.25,
            },
            {
                enemies: [barkChargerData.enemyId, barkChargerData.enemyId],
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
};

const elitCombatNode: NodeConfig = {
    type: ExpeditionMapNodeTypeEnum.Combat,
    subType: ExpeditionMapNodeTypeEnum.CombatElite,
    data: {
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
};

const bossNode: NodeConfig = {
    type: ExpeditionMapNodeTypeEnum.Combat,
    subType: ExpeditionMapNodeTypeEnum.CombatBoss,
    data: {
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
};

const campNode: NodeConfig = {
    type: ExpeditionMapNodeTypeEnum.Camp,
    subType: ExpeditionMapNodeTypeEnum.CampRegular,
};

export default function (initialNodeId = 0) {
    const actBuilder = new DefaultActBuilder(1, initialNodeId);

    actBuilder.addRandgeOfSteps(3, (step) => {
        step.addRangeOfNodes(3, 5, basicInitialCombatNode);
    });

    actBuilder.addRandgeOfSteps(8, (step) => {
        step.addRangeOfNodes(2, 4);
    });

    actBuilder.addStep((step) => {
        step.addRangeOfNodes(3, 5, elitCombatNode);
    });

    actBuilder.addStep((step) => {
        step.addNode(campNode);
    });

    actBuilder.addRandgeOfSteps(7, (step) => {
        step.addRangeOfNodes(2, 4);
    });

    actBuilder.addStep((step) => {
        step.addNode(campNode);
    });

    actBuilder.addStep((step) => {
        step.addNode(bossNode);
    });

    let pool: NodeTypePool;
    const data: DefaultNodeDataFiller = new DefaultNodeDataFiller();

    actBuilder.fillUndefinedNodes((node, nodes) => {
        pool = pool || new NodeTypePool(nodes.length);

        const config = pool.popRandom();
        data.fill(config, node.step);

        return config;
    });

    return actBuilder.getNodes();
}