import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ethers } from 'ethers';

@Controller('tokens')
export class TokenController {
    @ApiOperation({
        summary: 'Token Gating',
    })
    @Post('/verify')
    handleTokenGating(
        @Body()
        {
            sig,
            wallet,
            created,
            message,
        }: {
            sig: string;
            wallet: string;
            created: number;
            message: string;
        },
    ): { isValid: boolean } {
        const timeNow = Math.floor(Date.now() / 1000);

        //if (timeNow >= expires) return { isValid: false };

        //const hash = `KOTE\nAction: Login\nEntropy: ${created}\nExpires: ${message}`;

        //const msgHash = ethers.utils.hashMessage(hash);
        const msgHash = ethers.utils.hashMessage(message);

        //const msgHashBytes = ethers.utils.arrayify(msgHash);
        const msgHashBytes = msgHash;

        const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig);

        return {
            isValid: recoveredAddress.toLowerCase() === wallet.toLowerCase(),
        };
    }
}
