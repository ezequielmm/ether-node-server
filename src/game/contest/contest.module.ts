import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { Contest } from './contest.schema';
import { ContestService } from './contest.service';

@Module({
    imports: [KindagooseModule.forFeature([Contest])],
    providers: [ContestService],
    exports: [ContestService, KindagooseModule],
})
export class ContestModule {}
