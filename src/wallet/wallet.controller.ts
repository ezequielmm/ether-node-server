import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @ApiOperation({
        summary: 'Get NFT',
    })
    @Get(':id')
    async getTokenList(@Param('id') walletId: string): Promise<string[]> {
        return await this.walletService.getTokenIdList(walletId);
    }
}
