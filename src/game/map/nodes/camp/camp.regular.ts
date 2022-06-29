import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import Camp from './camp';

class CampRegular extends Camp {
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

export default CampRegular;
