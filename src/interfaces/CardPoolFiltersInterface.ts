import { CardpoolVisibilityEnum } from '@prisma/client';

export interface CardPoolFiltersInterface {
    name?: string;
    id?: string;
    visibility?: CardpoolVisibilityEnum;
}
