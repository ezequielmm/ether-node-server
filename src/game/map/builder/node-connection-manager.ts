import { filter, random } from 'lodash';
import { Node } from 'src/game/components/expedition/node';

export class NodeConnectionManager {
    constructor(
        private readonly minExitsPerNode: number,
        private readonly maxExitsPerNode: number,
    ) {}

    public configureConnections(nodes: Node[], maxNodesStep:number) {
        nodes.forEach((node) => {
            this.configureNodeConnections(node, nodes, node.step, maxNodesStep);
        });
    }

    private configureNodeConnections(node: Node, nodes: Node[], step: number, nodesByStep:number) {
        const exitsAmount = random(this.minExitsPerNode, this.maxExitsPerNode);
        const exits = [];

        // Select a List of nodes innext step as candidates for connections
        // Valid candidates should to the next step and must not be the current node itself
        const candidateNodes = filter(nodes, { step: step + 1 });
        const nodeBelowMe = node.id + nodesByStep;

        const nodesInRange = candidateNodes.filter((node) => node.id == (nodeBelowMe - 1) || node.id == (nodeBelowMe + 1) || node.id == nodeBelowMe);

        if (nodesInRange.length > 0) {
            // Loop until reaching the set amount of exits or getting out of candidates
            while (exits.length < exitsAmount && nodesInRange.length > 0) {
                // remove the evaluated node from the list of candidates to avoid trying to use the same one over and over
                if (this.validConnection(node, nodesInRange[0], nodes)) {
                    exits.push(nodesInRange[0].id);
                    node.exits.push(nodesInRange[0].id);
                    nodesInRange[0].enter.push(node.id);
                }
                nodesInRange.shift();
            }
            // Check if current node has no enters, and create a connection to a previous node if so
            // if (node.step > 0 && node.enter.length === 0) {
            //     const previousStepLastNode = filter(nodes, {
            //         step: step - 1,
            //     }).splice(-1)[0];
            //     previousStepLastNode.exits.push(node.id);
            //     node.enter.push(previousStepLastNode.id);
            // }
        }
        return exits;
    }

    private validConnection(
        originNode: Node,
        targetNode: Node,
        nodes: Node[],
    ): boolean {
        let valid = false;
        const previousNodes = nodes.filter(
            (node) => node.step === originNode.step && node.id < originNode.id,
        );
        if (previousNodes.length === 0) {
            valid = true;
        } else {
            for (let index = 0; index < previousNodes.length; index += 1) {
                const node = previousNodes[index];
                if (node.exits.every((exit: number) => exit <= targetNode.id)) {
                    valid = true;
                } else {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }
}
