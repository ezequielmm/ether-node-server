export const config = () => ({
    app: {
        port: parseInt(process.env.APP_PORT) || 3000,
    },
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        entities: ['dist/**/*.entity.js'],
    },
});
