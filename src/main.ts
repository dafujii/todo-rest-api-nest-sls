import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('ToDo')
    .setDescription('ToDo Rest API description')
    .setVersion('1.0')
    .addTag('ToDo')
    .setBasePath('dev')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('dev');
  await app.listen(3000);
}
bootstrap();
