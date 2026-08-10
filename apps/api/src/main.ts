import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure production-ready CORS
  const corsOrigin = process.env.CORS_ORIGIN;
  const allowedOrigins = corsOrigin
    ? corsOrigin.split(',').map((origin) => origin.trim())
    : true; // Default to true (allows all origins in dev if not set)

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Smart Cart core API running on port: ${port}`);
}
bootstrap();
