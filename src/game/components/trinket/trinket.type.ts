export type TrinketId = number | string;

export function getTrinketField(trinketId: TrinketId): string {
    return typeof trinketId === 'string' ? 'id' : 'trinketId';
}
