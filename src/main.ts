import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CardPoolModule } from './cardPool/cardPool.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';
import * as compression from 'compression';
import { existsSync, readFileSync } from 'fs';
import express from 'express';
import https from 'https';

async function bootstrap() {
    const certFilePath = process.env.SSL_CERT_PATH;
    const keyFilePath = process.env.SSL_KEY_PATH;
    const options: any = {};

    if (certFilePath && keyFilePath) {
        if (existsSync(certFilePath) && existsSync(keyFilePath)) {
            options.httpsOptions = {
                cert: readFileSync(certFilePath),
                key: readFileSync(keyFilePath),
            };
        }
    }

    const app = await NestFactory.create(AppModule, options);

    //Enable Validation
    app.useGlobalPipes(new ValidationPipe());

    // Add Resource Interceptor
    app.useGlobalInterceptors(new TransformDataResource());

    // Add custom validation modules
    useContainer(app.select(CardPoolModule), { fallbackOnErrors: true });

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

    if (certFilePath && keyFilePath) {
        await app.init();
        const server = express();
        https.createServer(options, server).listen(3000);
    } else {
        await app.listen(3000);
    }
}
bootstrap();
