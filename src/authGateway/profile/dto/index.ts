export class CreateProfileDTO {
    readonly _id: number;
    readonly name: string;
    readonly email: string;
}

export class UpdateProfileDTO {
    readonly name?: string;
    readonly email?: string;
}
