import { Player } from '@prisma/client';

export interface Profile {
    id: string;
    name: string;
    email: string;
    wallets: [];
    act_map: string;
    player: Player;
}
