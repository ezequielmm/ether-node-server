import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CardService } from 'src/card/card.service';

@ValidatorConstraint({ name: 'UniqueNameOnCardsTable', async: true })
@Injectable()
export class UniqueNameOnCardsTableRule
    implements ValidatorConstraintInterface
{
    constructor(private service: CardService) {}

    async validate(name: string): Promise<boolean> {
        return await this.service.checkIfNameExists(name);
    }

    defaultMessage(): string {
        return `This name is already being used`;
    }
}

export function UniqueNameOnCardsTable(validatorOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UniqueNameOnCardsTable',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: UniqueNameOnCardsTableRule,
        });
    };
}
