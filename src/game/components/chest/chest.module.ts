import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { Chest } from './chest.schema';
import { ChestService } from './chest.service';

@Module({
    imports: [KindagooseModule.forFeature([Chest])],
    providers: [ChestService],
    exports: [ChestService],
})
export class ChestModule {}
