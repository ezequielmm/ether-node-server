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
    getTokenList(@Param('id') walletId: string) {
        return this.walletService.getTokenIdList(walletId);
    }
}
