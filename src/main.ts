import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Global prefix for all routes
  app.setGlobalPrefix("api");

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>("cors.origin"),
    credentials: configService.get<boolean>("cors.credentials"),
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI documentation
  if (configService.get<string>("nodeEnv") !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Nest Eggs API")
      .setDescription(
        "A modern NestJS backend API with authentication and user management",
      )
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "JWT",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT-auth",
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    logger.log("Swagger documentation available at /api/docs");
  }

  const port = configService.get<number>("port") || 3003;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${configService.get<string>("nodeEnv")}`);
}

bootstrap().catch((err) => {
  const logger = new Logger("Bootstrap");
  logger.error("Error starting the application", err);
  process.exit(1);
});
