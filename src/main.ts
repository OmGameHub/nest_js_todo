import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { validationOptions } from "./utils/validation-options";
import * as cookieParser from "cookie-parser";
import { ExceptionResponseFilter } from "./common/filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix("api");

  // Enable versioning
  app.enableVersioning({ type: VersioningType.URI });

  // Global Validations
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(",") || [], // Allow all origins
    methods: "GET,PUT,PATCH,POST,DELETE", // Allowed methods
    credentials: true, // Allow credentials (e.g., cookies)
    allowedHeaders: "Content-Type, Accept", // Allowed headers
  });

  app.use(cookieParser());

  // Global Filters
  app.useGlobalFilters(new ExceptionResponseFilter());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
