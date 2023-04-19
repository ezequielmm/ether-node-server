import { Module } from '@nestjs/common';
import { TroveService } from './trove.service';

@Module({
    providers: [TroveService],
    exports: [TroveService],
})
export class TroveModule {}
