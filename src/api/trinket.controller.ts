import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trinket } from '../components/trinket/trinket.schema';

@ApiBearerAuth()
@ApiTags('Trinket')
@Controller('trinkets')
@UseGuards(new AuthGuard())
export class TrinketController {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<Trinket>,
    ) {}

    @ApiOperation({
        summary: 'Get all trinkets',
    })
    @Get()
    async handleGetTrinkets(): Promise<Trinket[]> {
        return this.trinket.find().lean();
    }
}
