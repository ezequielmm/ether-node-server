import { ExpeditionPlayerStateDeckInterface } from './expeditionPlayerStateDeck.interface';

export interface ExpeditionPlayerStateInterface {
    readonly character_class: string;
    readonly gold_coins_default?: number;
    readonly gold_coins_current_state?: number;
    readonly potions?: object;
    readonly trinkets?: [];
    readonly deck?: ExpeditionPlayerStateDeckInterface;
    readonly created_at: Date;
    readonly stopped_at?: Date;
}
