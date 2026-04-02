import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          
      forbidNonWhitelisted: true, 
      transform: true,         
    }),
  );

   const config = new DocumentBuilder()
    .setTitle("School Control API")
    .setDescription("Descrição da API.")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);   // UI em /docs

  await app.listen(process.env.AUTH_PORT!); 
}
bootstrap();
