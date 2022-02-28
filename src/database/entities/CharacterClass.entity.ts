import { IsString, MaxLength, MinLength } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 255 })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;
}
