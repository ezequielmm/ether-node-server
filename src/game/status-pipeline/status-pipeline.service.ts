import { Injectable } from '@nestjs/common';
import { Card } from '../components/card/card.schema';

@Injectable()
export class StatusPipelineService {
    process(payload: { statuses: any; client_id: string }): void {
        const { statuses, client_id } = payload;
    }
}
