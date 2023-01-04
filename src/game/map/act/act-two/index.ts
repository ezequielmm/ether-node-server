import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeStatus } from 'src/game/components/expedition/node-status';
import { DefaultActBuilder, NodeConfig } from '../act.builder';
import { ActTwoNodeDataFiller } from './node-data-generator';
import { NodeTypePool } from '../node-type-pool';
import { NodeConnectionManager } from '../node-connection-manager';

const basicInitialCombatNode: NodeConfig = {
    title: 'Combat',
    type: NodeType.Combat,
    subType: NodeType.CombatStandard,
    data: {
        enemies: [
            {
                enemies: [sporeMongerData.enemyId],
                probability: 0.25,
            },
            {
                enemies: [barkChargerData.enemyId],
                probability: 0.25,
            },
            {
                enemies: [stingFaeData.enemyId],
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
    title: 'Elite Combat',
    type: NodeType.Combat,
    subType: NodeType.CombatElite,
    data: {
        enemies: [
            // {
            //     enemies: [thornWolfData.enemyId],
            //     probability: 33.3,
            // },
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
    title: 'Boss',
    type: NodeType.Combat,
    subType: NodeType.CombatBoss,
    data: {
        enemies: [
            // {
            //     enemies: [treantData.enemyId],
            //     probability: 0.5,
            // },
            {
                enemies: [fungalBruteData.enemyId],
                probability: 0.5,
            },
        ],
    },
};

const portalNode: NodeConfig = {
    title: 'Portal',
    type: NodeType.Portal,
    subType: NodeType.Portal,
    data: {},
};

const campNode: NodeConfig = {
    title: 'Spirit Well',
    type: NodeType.Camp,
    subType: NodeType.CampRegular,
};

export default function (initialNodeId = 0) {
    const actBuilder = new DefaultActBuilder(2, initialNodeId);

    actBuilder.addRangeOfSteps(3, (step) => {
        step.addRangeOfNodes(3, 5, basicInitialCombatNode);
    });

    actBuilder.addRangeOfSteps(8, (step) => {
        step.addRangeOfNodes(2, 4);
    });

    actBuilder.addStep((step) => {
        step.addRangeOfNodes(3, 5, elitCombatNode);
    });

    actBuilder.addStep((step) => {
        step.addNode(campNode);
    });

    actBuilder.addRangeOfSteps(7, (step) => {
        step.addRangeOfNodes(2, 4);
    });

    actBuilder.addStep((step) => {
        step.addNode(campNode);
    });

    actBuilder.addStep((step) => {
        step.addNode(bossNode);
    });

    actBuilder.addStep((step) => {
        step.addNode(portalNode);
    });

    let pool: NodeTypePool;
    const data: ActTwoNodeDataFiller = new ActTwoNodeDataFiller();
    const nodeConnectionManager = new NodeConnectionManager(1, 3);

    actBuilder.fillUndefinedNodes((node, nodes) => {
        pool = pool || new NodeTypePool(nodes.length);

        const config = pool.popRandom();
        data.fill(config, node.step);

        return config;
    });

    const nodes = actBuilder.getNodes();
    nodeConnectionManager.configureConnections(nodes);

    // Enable entrance nodes
    nodes
        .filter((node) => node.step == 0)
        .forEach((node) => {
            node.status = NodeStatus.Available;
        });

    return nodes;
}
