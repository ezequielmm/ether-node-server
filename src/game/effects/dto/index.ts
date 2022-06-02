import { CardDestinationEnum } from '../enums';

export interface BaseEffectDTO {
    readonly client_id: string;
}

export type DiscardAllCardsDTO = BaseEffectDTO;

export interface DiscardCardDTO extends BaseEffectDTO {
    readonly card_id: string;
}

export type ExhaustCardDTO = DiscardCardDTO;

export interface DrawCardEffectDTO extends BaseEffectDTO {
    readonly cards_to_take?: number;
}

export interface UpdatePlayerEnergyDTO extends BaseEffectDTO {
    readonly energy: number;
}

export interface AddCardToPileDTO extends BaseEffectDTO {
    readonly card_id: string;
    readonly destination: CardDestinationEnum;
    readonly is_temporary: boolean;
}

export interface ModifyHPMaxDTO extends BaseEffectDTO {
    readonly hp_value: number;
}

export type TurnChangeDTO = BaseEffectDTO;

export interface DefenseDTO extends BaseEffectDTO {
    value: number;
}
