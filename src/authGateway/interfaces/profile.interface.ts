export interface IAuthProfile {
    readonly data: {
        readonly id: number;
        readonly name: string;
        readonly email: string;
    };
}

export type IProfile = IAuthProfile['data'];
