import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import ExpeditionMap from '../../map/expeditionMap';
import Node from '../node';

class RoyalHouse extends Node {
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
        if (this.isAvailable) {
            expeditionMap.disableAllNodes();
            this.complete(expeditionMap);
        }
    }
}

export default RoyalHouse;
