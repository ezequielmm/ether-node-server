import { Injectable } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ExpeditionService } from '../expedition.service';

@ValidatorConstraint({ name: 'ExpeditionExists', async: true })
@Injectable()
export class ExpeditionExistsRule implements ValidatorConstraintInterface {
    constructor(private service: ExpeditionService) {}

    async validate(playerId: string): Promise<boolean> {
        return this.service.playerHasAnExpedition(playerId);
    }

    defaultMessage(): string {
        return `This played has an expedition in progress`;
    }
}
