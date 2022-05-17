import ExpeditionMap from '../map/expeditionMap';
import { IExpeditionNode } from '../../interfaces';
class Node implements IExpeditionNode {
    id: number;
    act: number;
    step: number;
    type: string;
    exits: Array<number>;
    enter: Array<number>;
    status: string;
    state: any;
    private_data: any;
    private _expeditionMap?: ExpeditionMap;
    constructor(
        id: number,
        act: number,
        step: number,
        type: string,
        private_data: any,
    ) {
        this.id = id;
        this.act = act;
        this.step = step;
        this.type = type;
        this.exits = [];
        this.enter = [];
        this.status = 'disabled';
        this.private_data = private_data;
    }
    public get expeditionMap(): ExpeditionMap {
        return this._expeditionMap;
    }
    public set expeditionMap(value: ExpeditionMap) {
        this._expeditionMap = value;
    }

    openExitsNodes(): void {
        this.exits.forEach((exit) => {
            this.expeditionMap.fullCurrentMap
                .get(exit)
                .updateStatus('available');
        });
    }
    updateStatus(status: string): string {
        this.status = status;
        return status;
    }
    complete(): void {
        this.expeditionMap.disableAllNodes();
        this.updateStatus('completed');
        this.openExitsNodes();
    }
    selected(): void {
        this.updateStatus('active');
        this.expeditionMap.activeNode = this;
        this.complete();
    }
}

export default Node;
