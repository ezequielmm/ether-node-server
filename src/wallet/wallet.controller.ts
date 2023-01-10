import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
@Controller('wallets')
export class WalletController {

    constructor(private walletService :WalletService){}
    @Get(':id')
    getMe(@Param('id') walletId: string) {
        return this.walletService.getTokenIdList(walletId);
    }
}
