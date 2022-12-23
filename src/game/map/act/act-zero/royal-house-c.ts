import { RoyalHouseTitles } from 'src/game/components/expedition/expedition.enum';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from '../act.builder';

export const royalHouseC: NodeConfig = {
    type: NodeType.RoyalHouse,
    subType: NodeType.RoyalHouseC,
    data: {},
    title: RoyalHouseTitles.Medici,
};
