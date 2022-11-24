import { Reward } from '../components/expedition/expedition.interface';

export interface TreasureInterface {
    name: string;
    size: string;
    isOpen: boolean;
    rewards: Reward[];
}
