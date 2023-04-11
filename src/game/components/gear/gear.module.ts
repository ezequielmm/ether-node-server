import { Module } from '@nestjs/common';
import { Gear } from './gear.schema';
import { KindagooseModule } from 'kindagoose';
import { GearService } from './gear.service';

@Module({
    imports: [KindagooseModule.forFeature([Gear])],
    providers: [GearService],
    exports: [GearService, KindagooseModule],
})
export class GearModule {}
