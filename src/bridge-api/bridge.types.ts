import { ApiProperty } from "@nestjs/swagger";

export interface InitiationBridgeResponse {
    success: boolean;
    message: string | null;
}

export interface InProgressBridgeResponse {
    success: boolean;
    inProgress: string[] | null;
}

export interface GetNftsByWalletResponse {
    wallet: string,
    contracts: ContractBridgeResponse[]
}

export interface ContractBridgeResponse {
    token_count: number,
    characterClass: string,
    tokens: TokenBridgeResponse[],
    contract: string,
}

export interface TokenBridgeResponse {
    name: string,
    image: string | null,
    edition:number,
    attributes: NftAttributesResponse[],
}

export interface NftAttributesResponse {
    trait_type: string,
    value: string,
}

export class InitiationRequestDTO {

    @ApiProperty()
    readonly tokenId: number;
    
    @ApiProperty()
    readonly contract: string;

    @ApiProperty()
    readonly gearIds: number[];
    
    @ApiProperty()
    readonly wallet: string;
}