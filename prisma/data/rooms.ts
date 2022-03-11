import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const rooms: Prisma.RoomCreateManyInput = {
    id: uuidv4(),
    player_id: uuidv4(),
    status: 'in_progress',
};
