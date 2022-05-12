import Act from '../act/act';
// const nodeFactory = require('../nodes');

class MapGenerator {
    previousNodeId: number;
    previousStepNodes: number;
    previousActMap: Map<any, any>;
    newActMap: Map<any, any>;
    map: Map<any, any>;
    nextStep: Map<any, any>;
    currentStepNumber!: number;
    currentAct!: Act;
    currentNode: any;

    constructor() {
        this.previousNodeId = 1;
        this.previousStepNodes = 0;
        this.previousActMap = new Map();
        this.newActMap = new Map();
        this.map = new Map();
        this.nextStep = new Map();
        this.createAct0();
    }

    get currentMap() {
        return [...this.map.values()];
    }

    private createAct0(): void {
        const act0 = new Map();
        act0.set(1, {
            act: 0,
            step: 0,
            id: 1,
            type: 'royalhouse_a',
            exits: [5],
            enter: null,
        });
        act0.set(2, {
            act: 0,
            step: 0,
            id: 2,
            type: 'royalhouse_b',
            exits: [5],
            enter: null,
        });
        act0.set(3, {
            act: 0,
            step: 0,
            id: 3,
            type: 'royalhouse_c',
            exits: [5],
            enter: null,
        });
        act0.set(4, {
            act: 0,
            step: 0,
            id: 4,
            type: 'royalhouse_d',
            exits: [5],
            enter: null,
        });
        act0.set(5, {
            act: 0,
            step: 1,
            id: 5,
            type: 'portal',
            exits: [],
            enter: [1, 2, 3, 4, 5],
        });
        this.previousNodeId = 6;
        this.map = new Map(...[act0]);
    }

    public addAct(actNumber: number, actConfigAlternatives: any): void {
        // Clear currentStepNumber, nextStepNumber and newActMap to initial values.
        this.newActMap.clear();
        this.currentStepNumber = 0;
        this.currentAct = new Act(actNumber, actConfigAlternatives);
        for (let step = 0; step < this.currentAct.stepsTotal; step += 1) {
            const nodesToGenerate = this.nodesToGenerate();
            this.addNodes(step, nodesToGenerate);
        }
        this.createConnections();
        // Merge new ActMap with previous existentMap.
        this.map = new Map([...this.map, ...this.newActMap]);
    }

    private addNodes(step: number, nodesToGenerate: number) {
        for (
            let nodeNumber = 0;
            nodeNumber < nodesToGenerate;
            nodeNumber += 1
        ) {
            const nodeId = this.previousNodeId;
            this.previousNodeId += 1;
            const nodeProperties = this.currentAct.createNode(step);
            const node = {
                act: this.currentAct.actNumber,
                step,
                id: nodeId,
                type: nodeProperties.type,
                exits: [],
                enter: null,
                private_data: { ...nodeProperties.config },
            };
            this.newActMap.set(nodeId, node);
        }
    }

    private nodesToGenerate() {
        const min = this.currentAct.minNodesPerStep;
        const max = this.currentAct.maxNodesPerStep;
        function calculateNumberOfNodes(): number {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        let nodesToGenerate: number;
        // this IF may be redundant, is here just to obbey the requested condition
        if (max - min > 1) {
            nodesToGenerate = calculateNumberOfNodes();
            while (this.previousStepNodes === nodesToGenerate) {
                nodesToGenerate = calculateNumberOfNodes();
            }
            this.previousStepNodes = nodesToGenerate;
            return nodesToGenerate;
        }
        nodesToGenerate = calculateNumberOfNodes();
        return nodesToGenerate;
    }

    private calcExitsAmount() {
        const min = this.currentAct.minExitPerNode;
        const max = this.currentAct.maxExitPerNode;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private validConnection(originNode: any, targetNode: any): boolean {
        let valid = false;
        // If nodes belong to same step, they must be adjacent
        if (originNode.step === targetNode.step) {
            // two nodes from the same Step are adjacent if their id is subsequent
            const nodesDifference = Math.abs(originNode.id - targetNode.id);
            if (nodesDifference === 1) {
                // if target node has no enters from origin node return valid
                if (targetNode.enter !== null) {
                    if (
                        targetNode.enter.every(
                            (enter: any) => enter !== originNode.id,
                        ) &&
                        targetNode.exits.every(
                            (exit: any) => exit !== originNode.id,
                        )
                    ) {
                        valid = true;
                    }
                }
            }
            // Check if nodes belong to different steps
        } else if (originNode.step !== targetNode.step) {
            // console.log('originNode.step !== targetNode.step');
            const previousNodes = [...this.newActMap.values()].filter(
                (node) =>
                    node.step === originNode.step && node.id < originNode.id,
            );
            if (previousNodes.length === 0) {
                valid = true;
            } else {
                for (let index = 0; index < previousNodes.length; index += 1) {
                    const node = previousNodes[index];
                    if (
                        node.exits.every(
                            (exit: number) => exit <= targetNode.id,
                        )
                    ) {
                        valid = true;
                    } else {
                        valid = false;
                        break;
                    }
                }
            }
        }
        return valid;
    }

    private defineConnections(exitsAmount: number, step: number) {
        const exits = new Set();
        // Select a List of nodes in the current and next step as candidates for connections
        // Valid candidates should belong to same step or the next step and must not be the current node itself
        const candidateNodes = [...this.newActMap.values()].filter(
            (node) =>
                (node.step === step || node.step === step + 1) &&
                node.id !== this.currentNode.id,
        );
        if (candidateNodes.length > 0) {
            // Loop until reaching the set amount of exits or getting out of candidates
            while (exits.size < exitsAmount && candidateNodes.length > 0) {
                const candidateIndex = Math.floor(
                    Math.random() * candidateNodes.length,
                );
                const candidateNode = this.newActMap.get(
                    candidateNodes[candidateIndex].id,
                );
                // remove the evaluated node from the list of candidates to avoid trying to use the same one over and over
                candidateNodes.splice(candidateIndex, 1);
                if (this.validConnection(this.currentNode, candidateNode)) {
                    exits.add(candidateNode.id);
                    this.currentNode.exits.push(candidateNode.id);
                    const currentNodeEnters = this.newActMap.get(
                        candidateNode.id,
                    ).enter;
                    if (currentNodeEnters === null)
                        this.newActMap.get(candidateNode.id).enter = [];
                    this.newActMap
                        .get(candidateNode.id)
                        .enter.push(this.currentNode.id);
                }
            }
        }
        return exits;
    }

    private createConnections() {
        for (let step = 0; step < this.currentAct.stepsTotal; step += 1) {
            this.newActMap.forEach((node) => {
                if (node.step === step) {
                    this.currentNode = node;
                    const exitsAmount = this.calcExitsAmount();
                    this.defineConnections(exitsAmount, step);
                }
            });
        }
    }
}

export default MapGenerator;
