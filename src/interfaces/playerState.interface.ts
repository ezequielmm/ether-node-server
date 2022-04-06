export interface PlayerStateInterface {
    readonly className: string;
    readonly hp_max: number;
    readonly hp_current: number;
    readonly gold: number;
    readonly potions?: object;
    readonly trinkets?: [];
    readonly deck?: [];
    readonly private_data?: object;
}
