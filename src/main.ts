import {
    INestApplication,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';
import * as compression from 'compression';
import { existsSync, readFileSync } from 'fs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { serverEnvironments } from './utils';

let app: INestApplication;

async function bootstrap() {
    const certFilePath = process.env.SSL_CERT_PATH;
    const keyFilePath = process.env.SSL_KEY_PATH;

    if (certFilePath && keyFilePath) {
        if (existsSync(certFilePath) && existsSync(keyFilePath)) {
            app = await NestFactory.create(AppModule, {
                bufferLogs: true,
                httpsOptions: {
                    cert: readFileSync(certFilePath),
                    key: readFileSync(keyFilePath),
                },
            });
        }
    } else {
        app = await NestFactory.create(AppModule, {
            bufferLogs: true,
        });
    }

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

    // Get configService
    const configService = app.get(ConfigService);

    // Enable Swagger for API docs for dev only
    const env = configService.get<serverEnvironments>('NODE_ENV');

    if (env === serverEnvironments.development) {
        const config = new DocumentBuilder()
            .setTitle('KOTE Gameplay Service')
            .setDescription('API routes')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
    }

    if (env === serverEnvironments.production) {
        app.useLogger(app.get(Logger));
    }

    // Enable GZIP Compression
    app.use(compression());

    // Starts server
    await app.listen(3000);
}

bootstrap();
