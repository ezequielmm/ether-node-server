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

    public async select(expeditionMap: ExpeditionMap): Promise<void> {
        expeditionMap.disableAllNodes();
        await this.logSelected(expeditionMap.clientId);
        await this.complete(expeditionMap);
    }
}

export default RoyalHouse;
