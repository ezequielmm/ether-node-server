import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { ContestMap } from './contestMap.schema';
import { ContestMapService } from './contestMap.service';
@Module({
    imports: [KindagooseModule.forFeature([ContestMap])],
    providers: [ContestMapService],
    exports: [ContestMapService],
})
export class ContestMapModule {}
