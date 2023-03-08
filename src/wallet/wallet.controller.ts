import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @ApiOperation({
        summary: 'Get NFT',
    })
    @Get(':id')
    async getTokenList(
        @Param('id') walletId: string,
        @Query() query,
    ): Promise<string[]> {
        return await this.walletService.getTokenIdList(walletId,query.contractId,);
    }
}
