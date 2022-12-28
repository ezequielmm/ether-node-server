import { filter, ListIterateeCustom, random } from 'lodash';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeStatus } from 'src/game/components/expedition/node-status';
import { Node } from 'src/game/components/expedition/node';

/**
 * Object config for node
 */
export interface NodeConfig {
    /** Title of the node */
    title?: string;
    /** Primary type of the node */
    type: NodeType;
    /** Secondary type of the node */
    subType: NodeType;
    /** Optional data of the node*/
    data?: any;
}

/**
 * Callback used to add nodes to the desired step
 */
export type StepCallback = (
    step: Pick<ActBuilder, 'addNode' | 'addRangeOfNodes'>,
) => void;

/**
 * Callback used to fill undefined nodes
 */
export type FillUndefinedNodesCallback = (
    node: Node,
    nodes: Node[],
) => NodeConfig;

/**
 * A builder class for creating a map act
 */
export interface ActBuilder {
    /**
     * Add a step of nodes to the act
     *
     * @param {StepCallback} callback Callback to add nodes to the step added
     */
    addStep(callback: StepCallback): void;

    /**
     * Add range of steps to the act
     *
     * @param {number} length Number of steps to add
     * @param {StepCallback} callback Callback to add nodes to the step added
     */
    addRangeOfSteps(length: number, callback: StepCallback): void;

    /**
     * Add a node to the current step
     *
     * @param {NodeConfig} nodeConfig Configuration of the node
     */
    addNode(nodeConfig?: NodeConfig): void;

    /**
     * Add a range of nodes to the current step
     * generate random number of nodes between min and max
     *
     * @param {number} min Minimum number of nodes to add
     * @param {number} max Maximum number of nodes to add
     * @param {NodeConfig} nodeConfig Configuration of the node
     */
    addRangeOfNodes(min: number, max: number, nodeConfig?: NodeConfig): void;

    /**
     * Fill undefined nodes using callback
     *
     * @param {FillUndefinedNodesCallback} callback Callback to fill undefined nodes
     */
    fillUndefinedNodes(callback: FillUndefinedNodesCallback): void;

    /**
     * Get the act nodes
     *
     * @returns {Node[]} The act nodes
     */
    getNodes(): Node[];
}

export class DefaultActBuilder implements ActBuilder {
    private currentStep = -1;
    private readonly nodes: Node[] = [];

    constructor(
        private readonly actId: number,
        private initialNodeId: number = 0,
    ) {}

    getNodes(): Node[] {
        return this.nodes;
    }

    addStep(callback?: StepCallback): void {
        this.currentStep++;
        callback?.(this);
    }

    addRangeOfSteps(
        length: number,
        callback: (builder: ActBuilder) => void,
    ): void {
        for (let i = 0; i < length; i++) {
            this.addStep(callback);
        }
    }

    addNode(nodeConfig?: NodeConfig): void {
        if (this.currentStep === -1) {
            throw Error('You must add step before adding node');
        }

        this.nodes.push(this.createNode(nodeConfig));
    }

    addRangeOfNodes(min: number, max: number, nodeConfig?: NodeConfig): void {
        const count = random(min, max);

        for (let i = 0; i < count; i++) {
            this.addNode(nodeConfig);
        }
    }

    fillUndefinedNodes(
        callback: (node: Node, nodes: Node[]) => NodeConfig,
    ): void {
        this.fillByFilter({ type: undefined }, callback);
    }

    fillByFilter(
        _filter: ListIterateeCustom<Node, boolean>,
        callback: (node: Node, nodes: Node[]) => NodeConfig,
    ): void {
        filter(this.nodes, _filter).forEach((node) => {
            const index = this.nodes.indexOf(node);
            const nodeConfig = callback(node, this.nodes);
            const newNode = this.createNode(nodeConfig);
            newNode.id = node.id;
            newNode.step = node.step;
            this.nodes[index] = newNode;
        });
    }

    private createNode(config: NodeConfig): Node {
        return new Node({
            id: this.initialNodeId++,
            act: this.actId,
            step: this.currentStep,
            type: config?.type,
            subType: config?.subType,
            private_data: config?.data,
            title: config?.title,
            status: NodeStatus.Disabled,
            enter: [],
            exits: [],
        });
    }
}
