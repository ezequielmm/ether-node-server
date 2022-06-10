import { Module } from '@nestjs/common';
import { StandardResponseService } from './standardResponse.service';

@Module({
    providers: [StandardResponseService],
    exports: [StandardResponseService],
})
export class StandardResponseModule {}
