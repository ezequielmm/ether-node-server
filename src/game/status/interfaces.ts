export enum StatusName {
    Resolve = 'resolve',
}

export enum StatusType {
    Buff = 'buff',
}

export interface StatusConfig {
    name: StatusName;
    type: StatusType;
}

export interface StatusJson extends StatusConfig {
    args: object;
}

export interface IBaseStatus {
    handle(...args: any[]): Promise<any>;
}
