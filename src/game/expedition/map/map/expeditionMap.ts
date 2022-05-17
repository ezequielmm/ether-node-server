import Act from '../act/act';
import Node from '../nodes/node';
import nodeFactory from '../nodes/index';
import { actCconfigAlternatives } from '../act/act.config';

class ExpeditionMap {
    public activeNode: Node;
    private previousNodeId: number;
    private previousStepNodes: number;
    private currentNode: Node;
    private map: Map<number, Node>;
    private nextStep: Map<number, Node>;
    private newActMap: Map<number, Node>;
    private previousActMap: Map<number, Node>;
    private currentStepnumber?: number;
    private currentActNumber: number;
    private currentAct?: Act;

    constructor() {
        this.previousNodeId = 1;
        this.previousStepNodes = 0;
        this.previousActMap = new Map();
        this.newActMap = new Map();
        this.map = new Map();
        this.nextStep = new Map();
    }

    get getMap() {
        const map = [...this.map.values()];
        return map;
    }

    get fullCurrentMap() {
        return this.map;
    }

    public initMap() {
        this.createAct0();
        this.initAct(0);
    }

    public disableAllNodes() {
        this.map.forEach((node) => {
            if (node.status !== 'disabled' && node.status !== 'completed') {
                node.updateStatus('disabled');
            }
        });
    }

    private initAct(actNumber: number) {
        this.map.forEach((node) => {
            if (node.act === actNumber && node.step === 0)
                node.updateStatus('available');
        });
    }

    private createAct0(): void {
        const act0 = new Map();
        const royalA = nodeFactory(1, 0, 0, 'royalhouse_a', {});
        const royalB = nodeFactory(2, 0, 0, 'royalhouse_b', {});
        const royalC = nodeFactory(3, 0, 0, 'royalhouse_c', {});
        const royalD = nodeFactory(4, 0, 0, 'royalhouse_d', {});
        const portal = nodeFactory(5, 0, 1, 'portal', {});
        royalA.exits.push(5);
        royalB.exits.push(5);
        royalC.exits.push(5);
        royalD.exits.push(5);
        portal.enter.push(1, 2, 3, 4);
        act0.set(1, royalA);
        act0.set(2, royalB);
        act0.set(3, royalC);
        act0.set(4, royalD);
        act0.set(5, portal);
        this.previousNodeId = 6;
        this.map = new Map(...[act0]);
        royalA.expeditionMap = this;
        royalB.expeditionMap = this;
        royalC.expeditionMap = this;
        royalD.expeditionMap = this;
        this.currentActNumber = 0;
        this.embbedMapToNodes();
    }

    private embbedMapToNodes() {
        this.map.forEach((node) => {
            node.expeditionMap = this;
        });
    }
    public extendMap() {
        this.currentActNumber += 1;
        const config = actCconfigAlternatives;
        this.addAct(this.currentActNumber, config);
        this.initAct(this.currentActNumber);
    }
    private addAct(actnumber: number, actConfigAlternatives: any): void {
        // Clear currentStepnumber, nextStepnumber and newActMap to initial values.
        this.newActMap.clear();
        this.currentStepnumber = 0;
        this.currentAct = new Act(actnumber, actConfigAlternatives);
        for (let step = 0; step <= this.currentAct.stepsTotal; step += 1) {
            const nodesToGenerate = this.nodesToGenerate();
            this.addNodes(step, nodesToGenerate);
        }
        this.createConnections();
        // Merge new ActMap with previous existentMap.
        this.map = new Map([...this.map, ...this.newActMap]);
        this.embbedMapToNodes();
    }

    private addNodes(step: number, nodesToGenerate: number) {
        for (
            let nodenumber = 0;
            nodenumber < nodesToGenerate;
            nodenumber += 1
        ) {
            const nodeId = this.previousNodeId;
            this.previousNodeId += 1;
            const nodeProperties = this.currentAct.createNode(step);
            const node = nodeFactory(
                nodeId,
                this.currentAct.actnumber,
                step,
                nodeProperties.type,
                nodeProperties.config,
            );
            this.newActMap.set(nodeId, node);
        }
    }

    private nodesToGenerate() {
        const min = this.currentAct.minNodesPerStep;
        const max = this.currentAct.maxNodesPerStep;
        function calculatenumberOfNodes(): number {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        let nodesToGenerate: number;
        // this IF may be redundant, is here just to obbey the requested condition
        if (max - min > 1) {
            nodesToGenerate = calculatenumberOfNodes();
            while (this.previousStepNodes === nodesToGenerate) {
                nodesToGenerate = calculatenumberOfNodes();
            }
            this.previousStepNodes = nodesToGenerate;
            return nodesToGenerate;
        }
        nodesToGenerate = calculatenumberOfNodes();
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

export default ExpeditionMap;
