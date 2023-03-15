import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@ApiTags('showNftNetwork')
@Controller('showNftNetwork')
export class ShowNftNetworkController {
    constructor(private readonly configService: ConfigService) {}

    @ApiOperation({ summary: 'Show nft network' })
    @Get('/')
    getNftNetwork(): string {
        return this.configService.get<string>('NFT_SERVICE_CHAIN_ID');
    }
}
