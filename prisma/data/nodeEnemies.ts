import { Prisma } from '@prisma/client';
import { enemies } from './enemies';
import { nodes } from './nodes';

export const nodeEnemies: Prisma.NodeEnemyCreateManyInput = {
    node_id: nodes.id,
    enemy_id: enemies.id,
    quantity: 1,
};
