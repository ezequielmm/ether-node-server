import { NodeStatus } from 'src/game/components/expedition/node-status';
import { DefaultActBuilder } from '../act.builder';
import { NodeConnectionManager } from '../node-connection-manager';
import { portalNode } from './portal';
import { royalHouseA } from './royal-house-a';
import { royalHouseB } from './royal-house-b';
import { royalHouseC } from './royal-house-c';
import { royalHouseD } from './royal-house-d';

export default function (initialNodeId = 0) {
    const actBuilder = new DefaultActBuilder(0, initialNodeId);

    actBuilder.addStep((step) => {
        step.addNode(royalHouseA);
        step.addNode(royalHouseB);
        step.addNode(royalHouseC);
        step.addNode(royalHouseD);
    });

    actBuilder.addStep((step) => {
        step.addNode(portalNode);
    });

    const nodeConnectionManager = new NodeConnectionManager(1, 3);
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
