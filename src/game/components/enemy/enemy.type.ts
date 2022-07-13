export type EnemyId = number | string;

export function enemyIdField(id: EnemyId): string {
    return typeof id === 'string' ? 'id' : 'enemyId';
}
