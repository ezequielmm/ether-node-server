import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
    private readonly dbConnectionString: string;

    get connectionString(): string {
        return this.dbConnectionString;
    }

    constructor(private readonly configService: ConfigService) {
        this.dbConnectionString = this.getConnectionStringFromEnvFile();
    }

    private getConnectionStringFromEnvFile(): string {
        const connectionString = this.configService.get<string>('MONGODB_URL');
        if (!connectionString)
            throw new Error(
                `No connection string has been provided in the .env file.`,
            );

        return connectionString;
    }
}
