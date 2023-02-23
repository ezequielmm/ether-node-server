import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';
import * as compression from 'compression';
import { existsSync, readFileSync } from 'fs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { serverEnvironments } from './utils';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { json, urlencoded } from 'express';

async function bootstrap() {
    let app: NestExpressApplication;

    const certFilePath = process.env.SSL_CERT_PATH;
    const keyFilePath = process.env.SSL_KEY_PATH;

    if (certFilePath && keyFilePath) {
        if (existsSync(certFilePath) && existsSync(keyFilePath)) {
            app = await NestFactory.create<NestExpressApplication>(AppModule, {
                httpsOptions: {
                    cert: readFileSync(certFilePath),
                    key: readFileSync(keyFilePath),
                },
                bufferLogs: true,
            });
        }
    } else {
        app = await NestFactory.create<NestExpressApplication>(AppModule, {
            bufferLogs: true,
        });
    }
    // Pino Logger
    app.useLogger(app.get(Logger));

    app.useWebSocketAdapter(new IoAdapter(app));

    //Enable Validation
    app.useGlobalPipes(new ValidationPipe());

    // Add Resource Interceptor
    app.useGlobalInterceptors(new TransformDataResource());

    // Enable Versioning
    app.enableVersioning({
        defaultVersion: '1',
        type: VersioningType.URI,
    });

    app.use(urlencoded({ extended: true, limit: '50mb' })); // prevent 423 errors fro bug reports

    // Get configService
    const configService = app.get(ConfigService);

    // Enable Swagger for API docs for dev only
    const env = configService.get<serverEnvironments>('NODE_ENV');

    if (env === serverEnvironments.development) {
        // Enable OpenAPI for testing
        const config = new DocumentBuilder()
            .setTitle('KOTE Gameplay Service')
            .setDescription('API routes')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);

        // Enable views for local socket client testing
        app.useStaticAssets(join(__dirname, '..', 'public'));
        app.setBaseViewsDir(join(__dirname, '..', 'views'));
        app.setViewEngine('hbs');
    } else {
        // Enable GZIP Compression
        app.use(compression());
    }

    // Starts server
    await app.listen(3000);
}

bootstrap();
