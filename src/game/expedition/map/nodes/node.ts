import ExpeditionMap from '../map/expeditionMap';
import { IExpeditionNode } from '../../interfaces';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../../enums';

class Node implements IExpeditionNode {
    id: number;
    act: number;
    step: number;
    type: ExpeditionMapNodeTypeEnum;
    status: ExpeditionMapNodeStatusEnum;
    exits: Array<number>;
    enter: Array<number>;
    state: any;
    private_data: any;
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        this.id = id;
        this.act = act;
        this.step = step;
        this.type = type;
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
        this.setActive();
        expeditionMap.activeNode = this;
        this.complete(expeditionMap);
    }
    public complete(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.setComplete();
        this.openExitsNodes(expeditionMap);
    }
    private openExitsNodes(expeditionMap: ExpeditionMap): void {
        this.exits.forEach((exit) => {
            expeditionMap.fullCurrentMap.get(exit).setActive();
        });
    }
}

export default Node;
