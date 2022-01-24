import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.use(cookieParser())
  app.setGlobalPrefix("/api/v1")
  app.enableCors({ credentials: true })

  await app.listen(8000)
}
bootstrap()