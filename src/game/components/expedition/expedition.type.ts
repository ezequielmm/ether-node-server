export function getClientIdField(clientIdOrUserAddress: string): string {
    return clientIdOrUserAddress.startsWith('0x') ? 'userAddress' : 'clientId';
}
