import * as dotenv from "dotenv"
import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

dotenv.config()

async function bootstrap() {
  const frontendUrl = process.env.FRONTEND_URL
  const whitelist = [frontendUrl, 'http://localhost:3000'];

  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.setGlobalPrefix("/api/v1")
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  })

  await app.listen(process.env.PORT || 8080)
}
bootstrap()
