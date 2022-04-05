import { Player } from './Player.interface';

export interface Profile {
    id: string;
    name: string;
    email: string;
    wallets: [];
    act_map: string;
    player: Player;
}
