export type EnemyId = number | string;

export function getEnemyIdField(id: EnemyId): string {
    return typeof id === 'string' ? 'id' : 'enemyId';
}
