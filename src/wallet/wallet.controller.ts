import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @Get(':id')
    getMe(@Param('id') walletId: string) {
        return this.walletService.getTokenIdList(walletId);
    }
}
