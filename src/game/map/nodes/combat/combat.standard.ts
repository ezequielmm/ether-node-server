import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import Combat from './combat';

class CombatStandard extends Combat {
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
export default CombatStandard;
