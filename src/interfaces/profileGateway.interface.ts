export interface ProfileGatewayInterface {
    readonly data: {
        readonly id: string;
        readonly name: string;
        readonly email: string;
        readonly wallets: [];
        readonly coins: number;
        readonly fief: number;
        readonly experience: number;
        readonly level: number;
        readonly act: number;
        readonly act_map: string;
    };
}
