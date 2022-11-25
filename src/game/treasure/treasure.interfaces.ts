import { Reward } from '../components/expedition/expedition.interface';
import { TreasureTypeEnum } from './treasure.enum';

export interface TreasureInterface {
    name: string;
    size: string;
    isOpen: boolean;
    rewards: Reward[];
    type: TreasureTypeEnum;
    trappedData?: TreasureTrappedData;
}

export interface TreasureTrappedData {
    textToShow: string;
    startsCombat: boolean;
    damage?: number;
}
