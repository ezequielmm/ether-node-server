import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
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
        title: string,
    ) {
        super(id, act, step, type, subType, private_data, title);
    }

    public select(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.complete(expeditionMap);
    }
}

export default RoyalHouse;
