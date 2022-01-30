import * as dotenv from "dotenv"
import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.setGlobalPrefix("/api/v1")
  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.UNTURSTED_BANK_URL, 'http://localhost:3000'],
    credentials: true
  })

  await app.listen(process.env.PORT || 8080)
}
bootstrap()
