import { ExpeditionDeckInterface } from './expeditionDeck.interface';

export interface ExpeditionPlayerStateInterface {
    readonly class_name: string;
    readonly hp_max: number;
    readonly hp_current: number;
    readonly gold: number;
    readonly potions?: object;
    readonly trinkets?: [];
    readonly deck?: ExpeditionDeckInterface;
    readonly private_data?: object;
}
