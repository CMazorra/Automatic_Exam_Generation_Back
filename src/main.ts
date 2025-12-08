import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('app');
  const config = new DocumentBuilder()
     .setTitle('Script')
     .setDescription('API description')
     .setVersion('0.1')
     .addBearerAuth()
     .build()
    
     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);   

     const fs = require('fs');
     const path = require('path');
     const outDir = path.join(process.cwd(), 'docs');

     // ensure docs directory exists before writing
     if (!fs.existsSync(outDir)) {
       fs.mkdirSync(outDir, { recursive: true });
     }

     fs.writeFileSync(path.join(outDir, 'openapi.json'), JSON.stringify(document, null, 2));

     app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true, // <- NECESARIO
    transformOptions: {
      enableImplicitConversion: true, // <- opcional pero recomendado
    },
  }),
);


  app.use(cookieParser());
  app.enableCors({origin: 'http://localhost:3000', credentials: true,});
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
