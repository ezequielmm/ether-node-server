export type ClientId = string | number;

export function getClientIdField(clientId: ClientId): string {
    return typeof clientId === 'string' ? 'clientId' : 'playerId';
}
