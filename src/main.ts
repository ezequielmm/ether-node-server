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
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const certFilePath = process.env.SSL_CERT_PATH;
    const keyFilePath = process.env.SSL_KEY_PATH;
    let httpsOptions: HttpsOptions = {};
    let app: INestApplication;

    if (certFilePath && keyFilePath) {
        if (existsSync(certFilePath) && existsSync(keyFilePath)) {
            httpsOptions = {
                cert: readFileSync(certFilePath),
                key: readFileSync(keyFilePath),
            };
            app = await NestFactory.create(AppModule, { httpsOptions });
        }
    } else {
        app = await NestFactory.create(AppModule);
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

    const localUrl = process.env.LOCAL_URL || 'http://localhost:3000';

    // Enable Swagger for API docs
    const config = new DocumentBuilder()
        .setTitle('KOTE Gameplay Service')
        .setDescription('API routes')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(localUrl, 'Local Server')
        .addServer(process.env.GATEWAY_URL, 'Gateway URL')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Enable GZIP Compression
    app.use(compression());

    await app.listen(3000);
}
bootstrap();
