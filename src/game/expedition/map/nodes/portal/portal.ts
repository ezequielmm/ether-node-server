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
    public select(expeditionMap: ExpeditionMap): void {
        if (this.isAvailable) {
        }
    }
    complete(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.setComplete();
        expeditionMap.extendMap();
        this.exits = expeditionMap.getMap
            .filter((node) => node.act === this.act + 1 && node.step === 0)
            .map((node) => node.id);
        this.openExitsNodes(expeditionMap);
    }
}

export default Portal;
