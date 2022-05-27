import ExpeditionMap from '../map/expeditionMap';
import { IExpeditionNode } from '../../interfaces';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../../enums';

class Node implements IExpeditionNode {
    public id: number;
    public act: number;
    public step: number;
    public type: ExpeditionMapNodeTypeEnum;
    public subType: ExpeditionMapNodeTypeEnum;
    public status: ExpeditionMapNodeStatusEnum;
    public exits: Array<number>;
    public enter: Array<number>;
    public state: any;
    public private_data: any;
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        this.id = id;
        this.act = act;
        this.step = step;
        this.type = type;
        this.subType = subType;
        this.exits = [];
        this.enter = [];
        this.status = ExpeditionMapNodeStatusEnum.Disabled;
        this.private_data = private_data;
    }

    public get isActive(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Active;
    }
    public get isDisable(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Disabled;
    }
    public get isAvailable(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Available;
    }
    public get isComplete(): boolean {
        return this.status === ExpeditionMapNodeStatusEnum.Completed;
    }
    public setActive(): void {
        this.status = ExpeditionMapNodeStatusEnum.Active;
    }
    public setDisable(): void {
        this.status = ExpeditionMapNodeStatusEnum.Disabled;
    }
    public setAvailable(): void {
        this.status = ExpeditionMapNodeStatusEnum.Available;
    }
    public setComplete(): void {
        this.status = ExpeditionMapNodeStatusEnum.Completed;
    }
    public select(expeditionMap: ExpeditionMap): void {
        if (this.isAvailable) {
            expeditionMap.disableAllNodes();
            this.setActive();
            expeditionMap.activeNode = this;
        }
    }
    public complete(expeditionMap: ExpeditionMap): void {
        this.setComplete();
        this.openExitsNodes(expeditionMap);
    }
    protected openExitsNodes(expeditionMap: ExpeditionMap): void {
        this.exits.forEach((exit) => {
            expeditionMap.fullCurrentMap.get(exit).setAvailable();
        });
    }
}

export default Node;
