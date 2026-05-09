import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { initializeTransactionalContext } from "typeorm-transactional";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import "./utils/concurrent.util";

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  app.use(cookieParser());

  SwaggerModule.setup(
    "/api",
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Project API")
        .setDescription("API documentation")
        .addBearerAuth()
        .addSecurityRequirements("bearer")
        .setVersion("1.0")
        .build(),
    ),
    {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
      },
    },
  );

  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3000;

  await app.listen(port);
  console.log(`View documents at: http://localhost:${port}/api`);
}
bootstrap();

process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e);
});
process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection", e);
});
