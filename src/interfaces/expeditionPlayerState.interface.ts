import { ExpeditionPlayerStateDeckInterface } from './expeditionPlayerStateDeck.interface';

export interface ExpeditionPlayerStateInterface {
    readonly class_name: string;
    readonly hp_max: number;
    readonly hp_current: number;
    readonly gold: number;
    readonly potions?: object;
    readonly trinkets?: [];
    readonly deck?: ExpeditionPlayerStateDeckInterface;
    readonly private_data?: object;
}
