import { Injectable } from '@nestjs/common';
import { MapService } from 'src/game/map/map.service';

@Injectable()
export class TaskService {
    constructor(private readonly mapService: MapService) {}

    async handleMapCreation(): Promise<void> {
        // First we get the current date
        const currentDate = new Date();
    }
}
