export interface BaseEffectDTO {
    readonly client_id: string;
}

export type DiscardAllCardsDTO = BaseEffectDTO;

export interface DiscardCardDTO extends BaseEffectDTO {
    readonly card_id: string;
}

export interface DrawCardEffectDTO extends BaseEffectDTO {
    readonly cards_to_take?: number;
}

export interface UpdatePlayerEnergy extends BaseEffectDTO {
    readonly energy: number;
}
