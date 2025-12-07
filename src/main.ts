import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('app');
  const config = new DocumentBuilder()
     .setTitle('Script')
     .setDescription('API description')
     .setVersion('0.1')
    //   .addBearerAuth(  // 👈 ESTA LÍNEA AGREGA EL BOTÓN “Authorize”
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Introduce tu token JWT aquí',
    //     in: 'header',
    //   },
    //   'access-token', // nombre de la referencia, puedes dejarlo así
    // )
     .build()
    
     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);   
  app.use(cookieParser());
  app.enableCors({origin: 'http://localhost:5000', credentials: true,});
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
