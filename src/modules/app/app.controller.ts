import * as bcrypt from 'bcrypt'
import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { AppService } from './app.service'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
  ) { }

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await this.appService.create({
      name,
      username,
      password: hashedPassword
    })
    delete user.password

    return user
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.appService.findOne({ username })
    if (!user) {
      throw new BadRequestException('invalid credentials')
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new BadRequestException('invalid credentials')
    }

    const jwt = await this.jwtService.signAsync({ id: user.id })
    response.cookie('jwt', jwt, { httpOnly: true })
    return {
      message: 'success'
    }
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)
      if (!data) {
        throw new UnauthorizedException()
      }

      const user = await this.appService.findOne({ id: data['id'] })
      delete user.password

      return user
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt')
    return {
      message: 'success'
    }
  }
}
