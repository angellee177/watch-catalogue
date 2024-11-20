import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogLevel, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description and interactive documentation')
    .setVersion('1.0')
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // Accessible at /api-docs

    // Set log levels explicitly
    const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
    app.useLogger(logLevels);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
