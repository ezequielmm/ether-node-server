import Act from '../act/act';
import Node from '../nodes/node';
import nodeFactory from '../nodes/index';
import { actCconfigAlternatives } from '../act/act.config';
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { IExpeditionNode } from 'src/game/components/expedition/expedition.interface';

class ExpeditionMap {
    public readonly clientId?: string;
    private previousNodeId: number;
    private previousStepNodes: number;
    public activeNode: Node;
    private currentNode: Node;
    private map: Map<number, Node>;
    private nextStep: Map<number, Node>;
    private newActMap: Map<number, Node>;
    private previousActMap: Map<number, Node>;
    private currentStepnumber?: number;
    private currentActNumber: number;
    private currentAct?: Act;

    constructor(clientId?: string) {
        this.clientId = clientId;
    }

    public restoreMapFromArray(map: IExpeditionNode[]): void {
        this.previousNodeId = map.length + 1;
        this.previousActMap = new Map();
        this.newActMap = new Map();
        this.map = new Map();
        this.nextStep = new Map();
        this.currentActNumber = map[map.length - 1].act;
        map.forEach((node: IExpeditionNode) => {
            const nodeObj = nodeFactory(
                node.id,
                node.act,
                node.step,
                node.type,
                node.subType,
                node.private_data,
            );
            nodeObj.exits = node.exits;
            nodeObj.enter = node.enter;
            nodeObj.status = node.status;
            this.map.set(node.id, nodeObj);
        });
    }
    get getMap() {
        const map = [...this.map.values()];
        return map;
    }

    get fullCurrentMap() {
        return this.map;
    }

    public initMap() {
        this.previousNodeId = 1;
        this.previousStepNodes = 0;
        this.previousActMap = new Map();
        this.newActMap = new Map();
        this.map = new Map();
        this.nextStep = new Map();
        this.createAct0();
        this.initAct(0);
    }

    public disableAllNodes() {
        this.map.forEach((node) => {
            if (!node.isComplete) node.setDisable();
        });
    }

    public disableAllNodesExcept(nodeId: number) {
        this.map.forEach((node) => {
            if (node.id !== nodeId) {
                node.setDisable();
            }
        });
    }

    private createAct0(): void {
        const act0 = new Map();
        const royalA = nodeFactory(
            1,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseA,
            {},
        );
        const royalB = nodeFactory(
            2,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseB,
            {},
        );
        const royalC = nodeFactory(
            3,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseC,
            {},
        );
        const royalD = nodeFactory(
            4,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseD,
            {},
        );
        const portal = nodeFactory(
            5,
            0,
            1,
            ExpeditionMapNodeTypeEnum.Portal,
            ExpeditionMapNodeTypeEnum.Portal,
            {},
        );
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
        this.currentActNumber = 0;
    }

    public extendMap() {
        this.currentActNumber += 1;
        const config = actCconfigAlternatives;
        this.addAct(this.currentActNumber, config);
        this.initAct(this.currentActNumber);
    }

    private initAct(actNumber: number) {
        this.map.forEach((node) => {
            if (node.act === actNumber && node.step === 0) {
                node.setAvailable();
            }
        });
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
        this.MergeCurrentAndNewMap();
    }

    private MergeCurrentAndNewMap() {
        // Merge new ActMap with previous existentMap.
        this.map = new Map([...this.map, ...this.newActMap]);
    }

    private addNodes(step: number, nodesToGenerate: number) {
        for (let count = 0; count < nodesToGenerate; count += 1) {
            const nodeId = this.previousNodeId;
            this.previousNodeId += 1;
            const nodeProperties = this.currentAct.createNode(step);
            const node = nodeFactory(
                nodeId,
                this.currentAct.actnumber,
                step,
                nodeProperties.type,
                nodeProperties.subType,
                nodeProperties.config,
            );
            this.newActMap.set(nodeId, node);
            // Only one Boss or Portal per step.
            if (
                nodeProperties.subType ===
                    ExpeditionMapNodeTypeEnum.CombatBoss ||
                nodeProperties.subType === ExpeditionMapNodeTypeEnum.Portal
            ) {
                break;
            }
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
        const previousNodes = [...this.newActMap.values()].filter(
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

    private defineConnection(exitsAmount: number, step: number) {
        const exits = [];
        // Select a List of nodes innext step as candidates for connections
        // Valid candidates should to the next step and must not be the current node itself
        const candidateNodes = [...this.newActMap.values()].filter(
            (node) => node.step === step + 1,
        );
        if (candidateNodes.length > 0) {
            // Loop until reaching the set amount of exits or getting out of candidates
            while (exits.length < exitsAmount && candidateNodes.length > 0) {
                // remove the evaluated node from the list of candidates to avoid trying to use the same one over and over
                if (this.validConnection(this.currentNode, candidateNodes[0])) {
                    exits.push(candidateNodes[0].id);
                    this.currentNode.exits.push(candidateNodes[0].id);
                    this.newActMap
                        .get(candidateNodes[0].id)
                        .enter.push(this.currentNode.id);
                }
                candidateNodes.shift();
            }
            // Check if current node has no enters, and create a connection to a previous node if so
            if (
                this.currentNode.step > 0 &&
                this.currentNode.enter.length === 0
            ) {
                const previousStepLastNode = [...this.newActMap.values()]
                    .filter(
                        (node) =>
                            node.step === this.currentNode.step - 1 &&
                            node.act === this.currentNode.act,
                    )
                    .splice(-1)[0];
                this.newActMap
                    .get(previousStepLastNode.id)
                    .exits.push(this.currentNode.id);
                this.currentNode.enter.push(previousStepLastNode.id);
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
                    this.defineConnection(exitsAmount, step);
                }
            });
        }
    }
}

export default ExpeditionMap;
