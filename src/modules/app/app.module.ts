import * as dotenv from "dotenv"
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/users.entity'
import { AppController } from './app.controller'
import { AppService } from './app.service'

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
