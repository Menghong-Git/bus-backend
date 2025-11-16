import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // ✅ Serve static files (e.g. /uploads/profile)
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    // ✅ Log every incoming request (for debugging 404s or PATCH issues)
    app.use((req, res, next) => {
      console.log(` Standing on:  [${req.method}] ${req.originalUrl}`);
      next();
    });

    // ✅ Enable global validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // ✅ Enable CORS for frontend (Next.js)
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true, // <-- FIXED
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(
      `✅ Application started successfully on http://localhost:${port}`,
    );
  } catch (error) {
    logger.error('❌ Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();
