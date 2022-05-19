import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Combat from './combat';

class CombatElite extends Combat {
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
}

export default CombatElite;
