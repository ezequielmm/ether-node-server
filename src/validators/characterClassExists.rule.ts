import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CharacterClassService } from 'src/character-class/character-class.service';

@ValidatorConstraint({ name: 'CharacterClassExists', async: true })
@Injectable()
export class CharacterClassExistsRule implements ValidatorConstraintInterface {
    constructor(private service: CharacterClassService) {}

    async validate(id: string): Promise<boolean> {
        return await this.service.characterClassExists(id);
    }

    defaultMessage(): string {
        return `This character class doesn't exists`;
    }
}

export function CharacterClassExists(validatorOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'CharacterClassExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: CharacterClassExistsRule,
        });
    };
}
