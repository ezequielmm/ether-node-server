import { StateDeltaType } from './../elements/prototypes/types';
import { Injectable } from '@nestjs/common';
import { Diff, diff } from 'deep-diff';
import { cloneDeep, get, set, isEqual } from 'lodash';
import { ExpeditionService } from '../expedition/expedition.service';
interface CurrentStateType {
    [clientId: string]: any;
}
interface PreviousStateType {
    [clientId: string]: any;
}

interface StateType {
    current: CurrentStateType;
    previous: PreviousStateType;
}

interface StateCollectionType {
    [clientId: string]: StateType;
}

@Injectable()
export class StateManagerService {
    public readonly stateCollection: StateCollectionType;

    constructor(private readonly expeditionService: ExpeditionService) {
        this.stateCollection = {};
    }

    public async snapshot(clientId: string): Promise<void> {
        const state = this.stateCollection[clientId];

        if (!state) {
            await this.createState(clientId);
            return;
        }

        state.previous = cloneDeep(this.stateCollection[clientId].current);
    }

    private async createState(clientId: string): Promise<StateType> {
        const expedition = await this.expeditionService.findOne({
            client_id: clientId,
        });

        const state = {
            current: cloneDeep(expedition),
            previous: cloneDeep(expedition),
        };

        this.stateCollection[clientId] = state;
        return state;
    }

    public async modify(
        clientId: string,
        stateDelta: StateDeltaType,
    ): Promise<any> {
        let state = this.stateCollection[clientId];

        if (!state) {
            state = await this.createState(clientId);
            this.stateCollection[clientId] = state;
        }

        const modification = {
            previous:
                stateDelta.mod == 'mov'
                    ? {
                          source: get(state.current, stateDelta.source),
                          target: get(state.current, stateDelta.target),
                      }
                    : get(state.current, stateDelta.key),
            current:
                stateDelta.mod == 'mov'
                    ? {
                          source: get(state.current, stateDelta.source),
                          target: get(state.current, stateDelta.target),
                      }
                    : get(state.current, stateDelta.key),
        };

        switch (stateDelta.mod) {
            case 'set':
                modification.current = stateDelta.val;
                set(state.current, stateDelta.key, stateDelta.val);
                break;
            case 'add':
                modification.current = stateDelta.val + modification.current;
                set(state.current, stateDelta.key, modification.current);
                break;
            case 'sub':
                modification.current = modification.current - stateDelta.val;
                set(state.current, stateDelta.key, modification.current);
                break;
            case 'ins':
                switch (stateDelta.pos) {
                    case 'append':
                        modification.current = [
                            ...modification.current,
                            stateDelta.val,
                        ];
                        break;
                    case 'prepend':
                        modification.current = [
                            stateDelta.val,
                            ...modification.current,
                        ];
                        break;
                }
                set(state.current, stateDelta.key, modification.current);
                break;
            case 'rem':
                modification.current = modification.current.filter(
                    (item: any) =>
                        stateDelta.prop
                            ? item[stateDelta.prop] != stateDelta.val
                            : !isEqual(item, stateDelta.val),
                );
                set(state.current, stateDelta.key, modification.current);
                break;

            case 'mov':
                const source = modification.current.source;
                const itemsToMove = source.filter((item: any) =>
                    stateDelta.prop
                        ? item[stateDelta.prop] == stateDelta.val
                        : isEqual(item, stateDelta.val),
                );
                modification.current.source = source.filter(
                    (item: any) => itemsToMove.indexOf(item) === -1,
                );
                set(
                    state.current,
                    stateDelta.source,
                    modification.current.source,
                );
                if (stateDelta.pos === 'append') {
                    modification.current.target = [
                        ...modification.current.target,
                        ...itemsToMove,
                    ];
                } else {
                    modification.current.target = [
                        ...itemsToMove,
                        ...modification.current.target,
                    ];
                }
                set(
                    state.current,
                    stateDelta.target,
                    modification.current.target,
                );
                break;
        }

        return modification;
    }

    public getDiff(
        clientId: string,
    ): Diff<PreviousStateType, CurrentStateType>[] {
        const state = this.stateCollection[clientId];

        if (!state) {
            return null;
        }

        return diff(state.previous, state.current);
    }
}
