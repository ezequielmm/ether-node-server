type BaseStateDeltaType = {
    mod: 'add' | 'ins' | 'rem' | 'mov' | string;
    val: any;
};

export type AddStateDeltaType = BaseStateDeltaType & {
    mod: 'add';
    key: string;
    val: number;
};

export type SubStateDeltaType = BaseStateDeltaType & {
    mod: 'sub';
    key: string;
    val: number;
};

export type InsertStateDeltaType = BaseStateDeltaType & {
    mod: 'ins';
    key: string;
    pos: 'append' | 'prepend';
};

export type RemoveStateDeltaType = BaseStateDeltaType & {
    mod: 'rem';
    key: string;
    prop?: string;
};

export type MoveStateDeltaType = BaseStateDeltaType & {
    mod: 'mov';
    pos: 'append' | 'prepend';
    prop?: string;
    source: string;
    target: string;
};

export type StateDeltaType =
    | AddStateDeltaType
    | SubStateDeltaType
    | InsertStateDeltaType
    | RemoveStateDeltaType
    | MoveStateDeltaType;
