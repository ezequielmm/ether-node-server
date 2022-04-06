import { PlayerInterface } from './player.interface';

export interface ProfileInterface {
    id: string;
    name: string;
    email: string;
    wallets: [];
    act_map: string;
    player: PlayerInterface;
}
