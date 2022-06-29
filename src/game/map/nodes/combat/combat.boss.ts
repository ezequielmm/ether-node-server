import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import nodeFactory from '..';
import ExpeditionMap from '../../map/expeditionMap';
import Combat from './combat';

class CombatBoss extends Combat {
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
    public async complete(expeditionMap: ExpeditionMap): Promise<void> {
        this.setComplete();
        const portalId: number = expeditionMap.fullCurrentMap.size + 1;
        const portal = nodeFactory(
            portalId,
            this.act,
            this.step + 1,
            ExpeditionMapNodeTypeEnum.Portal,
            ExpeditionMapNodeTypeEnum.Portal,
            {},
        );
        portal.enter.push(this.id);
        this.exits.push(portal.id);
        expeditionMap.fullCurrentMap.set(portalId, portal);
        this.openExitsNodes(expeditionMap);
    }
}

export default CombatBoss;
