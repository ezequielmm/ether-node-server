export type CardId = number | string;

export function getCardIdField(cardId: CardId): string {
    return typeof cardId === 'string' ? 'id' : 'cardId';
}
