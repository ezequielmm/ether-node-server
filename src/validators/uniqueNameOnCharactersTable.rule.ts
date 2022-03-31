import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CharacterService } from 'src/character/character.service';

@ValidatorConstraint({ name: 'UniqueNameOnCharactersTable', async: true })
@Injectable()
export class UniqueNameOnCharactersTableRule
    implements ValidatorConstraintInterface
{
    constructor(private service: CharacterService) {}

    async validate(name: string): Promise<boolean> {
        return await this.service.checkIfNameExists(name);
    }

    defaultMessage(): string {
        return `This name is already being used`;
    }
}

export function UniqueNameOnCharactersTable(
    validatorOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UniqueNameOnCharactersTable',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: UniqueNameOnCharactersTableRule,
        });
    };
}
