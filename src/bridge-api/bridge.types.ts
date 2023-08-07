import { ApiProperty } from "@nestjs/swagger";

export interface InitiationBridgeResponse {
    success: boolean;
    message: string | null;
}

export interface InProgressBridgeResponse {
    success: boolean;
    inProgress: string[] | null;
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