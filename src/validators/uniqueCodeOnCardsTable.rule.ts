import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidatorOptions,
} from 'class-validator';
import { CardService } from 'src/card/card.service';

@ValidatorConstraint({ name: 'UniqueCodeOnCardsTable', async: true })
@Injectable()
export class UniqueCodeOnCardsTableRule
    implements ValidatorConstraintInterface
{
    constructor(private service: CardService) {}

    async validate(code: string): Promise<boolean> {
        return await this.service.checkIfCodeExists(code);
    }

    defaultMessage(): string {
        return `This code is already being used`;
    }
}

export function UniqueCodeOnCardsTable(validatorOptions?: ValidatorOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UniqueCodeOnCardsTable',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: UniqueCodeOnCardsTableRule,
        });
    };
}
