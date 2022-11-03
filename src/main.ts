import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV === 'development') {
    app.enableCors();
  }else{
    app.enableCors({origin: 'nestjs-task-management-production.up.railway.app'});
    logger.log(`Accepting requests from origin "nestjs-task-management-production.up.railway.app"`);
  }
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
