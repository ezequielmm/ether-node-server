import { filter, random } from 'lodash';
import Node from '../nodes/node';

export class NodeConnectionManager {
    constructor(
        private readonly minExitsPerNode: number,
        private readonly maxExitsPerNode: number,
    ) {}

    public configureConnections(nodes: Node[]) {
        nodes.forEach((node) => {
            this.configureNodeConnections(node, nodes, node.step);
        });
    }

    private configureNodeConnections(node: Node, nodes: Node[], step: number) {
        const exitsAmount = random(this.minExitsPerNode, this.maxExitsPerNode);
        const exits = [];

        // Select a List of nodes innext step as candidates for connections
        // Valid candidates should to the next step and must not be the current node itself
        const candidateNodes = filter(nodes, { step: step + 1 });

        if (candidateNodes.length > 0) {
            // Loop until reaching the set amount of exits or getting out of candidates
            while (exits.length < exitsAmount && candidateNodes.length > 0) {
                // remove the evaluated node from the list of candidates to avoid trying to use the same one over and over
                if (this.validConnection(node, candidateNodes[0], nodes)) {
                    exits.push(candidateNodes[0].id);
                    node.exits.push(candidateNodes[0].id);
                    candidateNodes[0].enter.push(node.id);
                }
                candidateNodes.shift();
            }
            // Check if current node has no enters, and create a connection to a previous node if so
            if (node.step > 0 && node.enter.length === 0) {
                const previousStepLastNode = filter(nodes, {
                    step: step - 1,
                }).splice(-1)[0];
                previousStepLastNode.exits.push(node.id);
                node.enter.push(previousStepLastNode.id);
            }
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
