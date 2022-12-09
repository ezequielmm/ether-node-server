import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
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
        title?: string,
    ) {
        super(id, act, step, type, subType, private_data, title);
    }
    public select(expeditionMap: ExpeditionMap): void {
        expeditionMap.disableAllNodes();
        this.complete(expeditionMap);
    }

    public complete(expeditionMap: ExpeditionMap): void {
        this.setComplete();
        expeditionMap.extendMap();
        // Create exits for this to all nodes in the step 0 of the generated Act.
        this.exits = expeditionMap.getMap
            .filter((node) => node.act === this.act + 1 && node.step === 0)
            .map((node) => node.id);
        this.openExitsNodes(expeditionMap);
        // TODO: Trigger 'MapExtended' event
    }

    protected openExitsNodes(expeditionMap: ExpeditionMap): void {
        this.exits.forEach((exit) => {
            expeditionMap.fullCurrentMap.get(exit).setAvailable();
            expeditionMap.fullCurrentMap.get(exit).enter.push(this.id);
        });
    }
}

export default Portal;
