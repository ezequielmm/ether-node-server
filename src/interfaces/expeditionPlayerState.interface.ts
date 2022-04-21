import { ExpeditionPlayerStateDeckInterface } from './expeditionPlayerStateDeck.interface';

export interface ExpeditionPlayerStateInterface {
    readonly player_name?: string;
    readonly character_class?: string;
    readonly hp_max?: number;
    readonly hp_current?: number;
    readonly gold?: number;
    readonly potions?: object;
    readonly trinkets?: [];
    readonly deck?: ExpeditionPlayerStateDeckInterface;
    readonly created_at?: Date;
    readonly stopped_at?: Date;
}
