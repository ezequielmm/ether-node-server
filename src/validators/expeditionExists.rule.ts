import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ExpeditionService } from '../expedition/expedition.service';

@ValidatorConstraint({ name: 'ExpeditionExists', async: true })
@Injectable()
export class ExpeditionExistsRule implements ValidatorConstraintInterface {
    constructor(private service: ExpeditionService) {}

    async validate(playerId: string): Promise<boolean> {
        return await this.service.playerHasAnExpedition(playerId);
    }

    defaultMessage(): string {
        return `This player has an expedition in progress`;
    }
}

export function ExpeditionExists(validatorOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'ExpeditionExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: ExpeditionExistsRule,
        });
    };
}
