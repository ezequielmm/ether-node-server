import { Module } from '@nestjs/common';
import { PlayerGearController } from './playerGear.controller';
import { KindagooseModule } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { PlayerGearService } from './playerGear.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [PlayerGearController],
    imports: [KindagooseModule.forFeature([PlayerGear]), HttpModule],
    providers: [PlayerGearService],
})
export class PlayerGearModule {}
