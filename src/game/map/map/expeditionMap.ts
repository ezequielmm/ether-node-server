import {
    ExpeditionMapNodeTypeEnum,
    RoyalHouseTitles,
} from 'src/game/components/expedition/expedition.enum';
import { IExpeditionNode } from 'src/game/components/expedition/expedition.interface';
import buildActOne from '../act/act-one/index';
import buildActTwo from '../act/act-two/index';
import nodeFactory from '../nodes/index';
import Node from '../nodes/node';

class ExpeditionMap {
    public readonly clientId?: string;
    private previousNodeId: number;
    public activeNode: Node;
    private map: Map<number, Node>;
    private currentActNumber: number;

    constructor(clientId?: string) {
        this.clientId = clientId;
    }

    public restoreMapFromArray(map: IExpeditionNode[]): void {
        this.previousNodeId = map.length + 1;
        this.map = new Map();
        this.currentActNumber = map[map.length - 1].act;
        map.forEach((node: IExpeditionNode) => {
            const nodeObj = nodeFactory(
                node.id,
                node.act,
                node.step,
                node.type,
                node.subType,
                node.private_data,
                node?.title,
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
        this.map = new Map();
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
            RoyalHouseTitles.Rhunn,
        );
        const royalB = nodeFactory(
            2,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseB,
            {},
            RoyalHouseTitles.Brightflame,
        );
        const royalC = nodeFactory(
            3,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseC,
            {},
            RoyalHouseTitles.Medici,
        );
        const royalD = nodeFactory(
            4,
            0,
            0,
            ExpeditionMapNodeTypeEnum.RoyalHouse,
            ExpeditionMapNodeTypeEnum.RoyalHouseD,
            {},
            RoyalHouseTitles.Cynthienne,
        );
        const portal = nodeFactory(
            5,
            0,
            1,
            ExpeditionMapNodeTypeEnum.Portal,
            ExpeditionMapNodeTypeEnum.Portal,
            {},
            'Portal',
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
        this.addAct(this.currentActNumber);
        this.initAct(this.currentActNumber);
    }

    private initAct(actNumber: number) {
        this.map.forEach((node) => {
            if (node.act === actNumber && node.step === 0) {
                node.setAvailable();
            }
        });
    }

    private addAct(actnumber: number): void {
        const nodes: Node[] = [];

        if (actnumber == 1) {
            nodes.push(...buildActOne(this.previousNodeId++));
        } else if (actnumber == 2) {
            nodes.push(...buildActTwo(this.previousNodeId++));
        }

        nodes.forEach((node) => {
            this.map.set(node.id, node);
        });
    }
}

export default ExpeditionMap;
