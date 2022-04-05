import { Equals, IsNotEmpty } from 'class-validator';

export class StartExpeditionDto {
    @IsNotEmpty()
    @Equals('knight')
    readonly character_class: string;
}
