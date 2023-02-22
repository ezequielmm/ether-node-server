export type EnemyId = number | string;

export function enemyIdField(id: EnemyId): string {
    return typeof id === 'string' ? 'id' : 'enemyId';
}

export function enemySelector(id: EnemyId): { [key: string]: EnemyId } {
    return { [`currentNode.data.enemies.${enemyIdField(id)}`]: id };
}
