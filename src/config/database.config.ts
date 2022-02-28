import * as path from 'path';

const baseDir = path.join(__dirname, '../');
const entitiesPath = `${baseDir}database/entities/*.entity{.ts,.js}`;
const migrationPath = `${baseDir}database/migrations/*{.ts,.js}`;

export default {
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [entitiesPath],
    migrations: [migrationPath],
    migrationsRun: process.env.DB_RUN_MIGRATIONS === 'true',
    cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
    },
};
