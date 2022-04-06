import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidatorOptions,
} from 'class-validator';
import { CardPoolService } from 'src/cardPool/cardPool.service';

@ValidatorConstraint({ name: 'UniqueNameOnCardPoolsTable', async: true })
@Injectable()
export class UniqueNameOnCardPoolsTableRule
    implements ValidatorConstraintInterface
{
    constructor(private readonly service: CardPoolService) {}

    async validate(name: string): Promise<boolean> {
        return await this.service.checkIfNameExists(name);
    }

    defaultMessage(): string {
        return `This name is already being used`;
    }
}

export function UniqueNameOnCardPoolsTable(
    validatorOptions?: ValidatorOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: UniqueNameOnCardPoolsTable.name,
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: UniqueNameOnCardPoolsTableRule,
        });
    };
}
