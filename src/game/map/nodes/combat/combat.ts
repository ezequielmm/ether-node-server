import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import ExpeditionMap from '../../map/expeditionMap';
import Node from '../node';

class Combat extends Node {
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
    }

    public select(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.setActive();
        expeditionMap.activeNode = this;
        this.stateInitialize();
    }

    protected stateInitialize(): any {
        this.state = this.private_data.enemies;
        return this.state;
    }
}

export default Combat;
