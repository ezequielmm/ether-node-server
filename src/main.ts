import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';
import { LocalAuthGuard } from './login/local-auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable Validation
    app.useGlobalPipes(new ValidationPipe());

    // Add Resource Interceptor
    app.useGlobalInterceptors(new TransformDataResource());

    // Enable Guards
    // app.useGlobalGuards(new LocalAuthGuard());

    // Enable Versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Enable Swagger for API docs
    const config = new DocumentBuilder()
        .setTitle('KOTE Gameplay Service')
        .setDescription('API routes')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(3000);
}
bootstrap();
