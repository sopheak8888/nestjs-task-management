import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV === 'development') {
    app.enableCors();
  }else{
    app.enableCors({origin: 'https://nestjs-task-management-production.up.railway.app'});
    logger.log(`Accepting requests from origin "https://nestjs-task-management-production.up.railway.app"`);
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
