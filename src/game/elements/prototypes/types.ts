type BaseStateDeltaType = {
    mod: 'add' | 'ins' | 'rem' | 'mov' | string;
    key: string;
    val: any;
};

export type AddStateDeltaType = BaseStateDeltaType & {
    mod: 'add';
    val: number;
};

export type SubStateDeltaType = BaseStateDeltaType & {
    mod: 'sub';
    val: number;
};

export type InsertStateDeltaType = BaseStateDeltaType & {
    mod: 'ins';
    pos: 'append' | 'prepend';
};

export type RemoveStateDeltaType = BaseStateDeltaType & {
    mod: 'rem';
    prop: string;
};

export type MoveStateDeltaType = BaseStateDeltaType & {
    mod: 'mov';
    pos: 'append' | 'prepend';
    prop: string;
    source: string;
    target: string;
};

export type StateDeltaType =
    | AddStateDeltaType
    | SubStateDeltaType
    | InsertStateDeltaType
    | RemoveStateDeltaType
    | MoveStateDeltaType;
