import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ClientId } from '../components/expedition/expedition.type';
import { JsonEffect } from '../effects/effects.interface';
import { EntityReferenceDTO } from '../status/interfaces';

export interface Registry {
    // Entity reference consume less space than the whole entity.
    source?: EntityReferenceDTO;
    target?: EntityReferenceDTO;
    type: 'status' | 'effect' | 'card' | 'damage';
}

export interface EffectRegistry extends Registry {
    type: 'effect';
    effect: JsonEffect;
}

export interface CardRegistry extends Registry {
    type: 'card';
    card: IExpeditionPlayerStateDeckCard;
    round: number;
}

export interface DamageRegistry extends Registry {
    type: 'damage';
    damage: number;
    turn: number;
}

export interface RegisterEffectDTO {
    clientId: ClientId;
    registry: CardRegistry | EffectRegistry | DamageRegistry;
}

export type HistoryDictionary = Map<ClientId, Registry[]>;