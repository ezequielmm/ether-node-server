import Service from './nft-library/services/moralis_service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';
import * as compression from 'compression';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { serverEnvironments } from './utils';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { json, urlencoded } from 'express';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });

    // Get configService
    const configService = app.get(ConfigService);

    // Pino Logger
    app.useLogger(app.get(Logger));

    const moralisApiKey = configService.get<string>('MORALIS_KEY');
    const moralisLogLevel = configService.get<string>('MORALIS_LOG_LEVEL');

    // Initialize Moralis Service
    Service.initialize(moralisApiKey, moralisLogLevel);

    // Initialize Websocket Adapter
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

    app.use(json({ limit: '40mb' }));
    app.use(urlencoded({ extended: true, limit: '40mb' })); // prevent 423 errors from bug reports

    // Enable CORS
    app.use(
        cors({
            origin: '*',
        }),
    );

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

    const port = configService.get<number>('APP_PORT', 3000);

    // Starts server
    await app.listen(port);
}

bootstrap();
