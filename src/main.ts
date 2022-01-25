import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.setGlobalPrefix("/api/v1")
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })

  await app.listen(8000)
}
bootstrap()
