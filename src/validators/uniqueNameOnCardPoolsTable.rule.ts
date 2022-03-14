import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CardPoolService } from 'src/cardpool/cardpool.service';

@ValidatorConstraint({ name: 'UniqueNameOnCardPoolsTable', async: true })
@Injectable()
export class UniqueNameOnCardPoolsTableRule
    implements ValidatorConstraintInterface
{
    constructor(private service: CardPoolService) {}

    async validate(name: string): Promise<boolean> {
        return await this.service.checkIfNameExists(name);
    }

    defaultMessage(): string {
        return `This name is already being used`;
    }
}

export function UniqueNameOnCardPoolsTable(
    validatorOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UniqueNameOnCardPoolsTable',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: UniqueNameOnCardPoolsTableRule,
        });
    };
}
