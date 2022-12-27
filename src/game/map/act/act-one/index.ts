import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { treantData } from 'src/game/components/enemy/data/treant.enemy';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeStatus } from 'src/game/components/expedition/node-status';
import { DefaultActBuilder, NodeConfig } from '../act.builder';
import { NodeTypePool } from '../node-type-pool';
import { NodeConnectionManager } from '../node-connection-manager';
import { ActOneNodeDataFiller } from './node-data-generator/index';

const basicCombatNode: NodeConfig = {
    title: 'Combat',
    type: NodeType.Combat,
    subType: NodeType.CombatStandard,
};

const elitCombatNode: NodeConfig = {
    title: 'Elite Combat',
    type: NodeType.Combat,
    subType: NodeType.CombatElite,
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
    type: NodeType.Portal,
    subType: NodeType.Portal,
    data: {},
    title: 'Portal',
};

const campNode: NodeConfig = {
    title: 'Spirit Well',
    type: NodeType.Camp,
    subType: NodeType.CampRegular,
};

export default function (initialNodeId = 0) {
    const actBuilder = new DefaultActBuilder(1, initialNodeId);

    actBuilder.addRangeOfSteps(3, (step) => {
        step.addRangeOfNodes(3, 5, basicCombatNode);
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

    // Set node types from pool
    let pool: NodeTypePool;

    // Get all nodes
    const nodes = actBuilder.getNodes();

    // Set node types from pool
    actBuilder.fillByFilter({ type: undefined }, (node, nodes) => {
        pool = pool || new NodeTypePool(nodes.length);
        return pool.popRandom();
    });

    // Act one filler
    const filler = new ActOneNodeDataFiller(nodes);

    // Fill data to nodes
    actBuilder.fillByFilter({ private_data: undefined }, (node) => {
        const config: NodeConfig = {
            type: node.type,
            subType: node.subType,
            title: node.title,
        };

        filler.fill(config, node.step);

        return config;
    });

    new NodeConnectionManager(1, 3).configureConnections(nodes);

    // Enable entrance nodes
    nodes
        .filter((node) => node.step == 0)
        .forEach((node) => {
            node.status = NodeStatus.Available;
        });

    return nodes;
}
