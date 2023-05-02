import { Injectable } from '@nestjs/common';
import { findLast } from 'lodash';
import { DeepPartial } from 'src/utils';
import {
    CardRegistry,
    EffectRegistry,
    HistoryDictionary,
    RegisterEffectDTO,
    Registry,
} from './interfaces';

@Injectable()
export class HistoryService {
    // History of all the clients, indexed by client id
    private readonly historyDictionary: HistoryDictionary = new Map();

    /**
     * Register an effect in the history, indexed by client id
     * if the client id is not present in the history, it will be created
     *
     * @param dto Register effect dto
     */
    register(dto: RegisterEffectDTO): void {
        const { clientId, registry } = dto;

        // If the client is not in the history, add it
        if (!this.historyDictionary.has(clientId)) {
            this.historyDictionary.set(clientId, []);
        }

        // Add the registry to the client history
        this.historyDictionary.get(clientId).push(registry);
    }

    /**
     * Get the history of a client
     * if the client id is not present in the history, it will return an empty array
     *
     * @param clientId Client id
     * @returns History of the client
     */
    get = (clientId: string): Registry[] =>
        this.historyDictionary.get(clientId) || [];

    /**
     * Return the last registry that matches the partial registry
     *
     * @param clientId Client id
     * @param registry Match registry
     * @returns Returns the last registry that matches the registry
     */
    findLast<T extends EffectRegistry | CardRegistry = EffectRegistry>(
        clientId: string,
        registry: DeepPartial<T>,
    ): T | undefined {
        // Get the history of the client
        const history = this.get(clientId);

        return findLast(history, registry) as T;
    }

    isEffect = (registry: Registry): registry is EffectRegistry =>
        registry.type === 'effect';

    /**
     * Clear the history of a client
     * if the client id is not present in the history, it will do nothing
     *
     * @param clientId Client id
     */
    clear(clientId: string): void {
        this.historyDictionary.delete(clientId);
    }
}
