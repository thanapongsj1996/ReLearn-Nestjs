import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException, Param, Delete } from '@nestjs/common'

import { AppService } from './app.service'

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
    const user = await this.appService.addUser({
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
    const user = await this.appService.findUserLogin({ username })
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

      const user = await this.appService.findUser({ id: data['id'] })
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

  @Post('posts')
  async createPost(
    @Body('body') body: string,
    @Req() request: Request
  ) {
    try {
      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)
      if (!data) {
        throw new UnauthorizedException()
      }

      const payload = {
        body,
        userId: data['id']
      }
      const post = await this.appService.createPost(payload)

      return post
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  @Get('posts')
  async getAllPosts() {
    const posts = await this.appService.getAllPosts()
    if (posts && posts.length > 0) {
      posts.map(p => delete p.user.password)
    }
    return posts
  }

  @Get('posts/user/:id')
  async getPostsByUserId(@Param("id") userId) {
    const posts = await this.appService.getPostsByUserId(userId)
    if (posts && posts.length > 0) {
      posts.map(p => delete p.user.password)
    }
    return posts
  }

  @Delete('posts/:id')
  async deletePostsByUserId(@Param("id") postId, @Req() request: Request) {
    try {
      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)
      if (!data) {
        throw new UnauthorizedException()
      }

      const post = await this.appService.getPostByPostId(postId)
      if (!post || post.userId !== data['id']) {
        throw new UnauthorizedException()
      }

      await this.appService.deletePostsByPostId(postId)

      return {
        message: "success"
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
