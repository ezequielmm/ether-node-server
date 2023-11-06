export interface NFTSFormattedResponse {
    wallet: string,
    tokens: ContractResponse[]
}

export interface ContractResponse {
    contract_address: string,
    token_count: number,
    characterClass: string,
    tokens: TokenResponse[]
}

export interface TokenResponse {
    token_id: string,
    contract_type: string, 
    name: string,
    metadata: TokenMetadata,
    characterClass: string,
    adaptedImageURI: string,
    can_play: boolean
}

export interface TokenMetadata {
    name: string,
    edition: number,
    image: string,
    attributes: MetadataAttributes[],
}

export interface MetadataAttributes {
    trait_type: string,
    value: string,
}