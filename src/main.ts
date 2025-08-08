import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/http-exception.filter";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3003);
}

bootstrap()
  .then(() => {
    console.log("App is running on port", process.env.PORT ?? 3003);
  })
  .catch((err) => {
    console.error(err);
  });
