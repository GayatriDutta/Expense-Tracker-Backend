import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: ['http://localhost:5173',
             'https://expense-tracker-blush-nu-94.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if sending cookies or authorization headers
  });

  await app.listen(5000);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
}
bootstrap();
