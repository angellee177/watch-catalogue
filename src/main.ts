import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description and interactive documentation')
    .setVersion('1.0')
    .addTag('users') // You can add tags for grouping endpoints
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // Accessible at /api-docs
    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
