export type PotionId = number | string;

export function getPotionIdField(potionId: PotionId): string {
    return typeof potionId === 'string' ? 'id' : 'potionId';
}
