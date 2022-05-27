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
            expeditionMap.disableAllNodes();
            this.complete(expeditionMap);
        }
    }
    public complete(expeditionMap: ExpeditionMap): void {
        this.setComplete();
        expeditionMap.extendMap();
        // Create exits for this to all nodes in the step 0 of the generated Act.
        this.exits = expeditionMap.getMap
            .filter((node) => node.act === this.act + 1 && node.step === 0)
            .map((node) => node.id);
        this.openExitsNodes(expeditionMap);
    }
    protected openExitsNodes(expeditionMap: ExpeditionMap): void {
        this.exits.forEach((exit) => {
            expeditionMap.fullCurrentMap.get(exit).setAvailable();
            expeditionMap.fullCurrentMap.get(exit).enter.push(this.id);
        });
    }
}

export default Portal;
