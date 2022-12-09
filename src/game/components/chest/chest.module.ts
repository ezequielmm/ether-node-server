import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Chest } from './chest.schema';
import { ChestService } from './chest.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Chest,
        ]),
    ],
    providers: [ChestService],
    exports: [ChestService],
})
export class ChestModule { }
