import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import ExpeditionMap from '../../map/expeditionMap';
import Node from '../node';

class Portal extends Node {
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

    complete(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.complete(expeditionMap);
        expeditionMap.extendMap();
    }
}

export default Portal;
