import { PlayerInterface } from './player.interface';

export interface ProfileInterface {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly wallets: [];
    readonly act_map: string;
    readonly player: PlayerInterface;
}
