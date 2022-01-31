import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Body, Controller, Get, Post, Headers, Req, Res, UnauthorizedException, Param, Delete } from '@nestjs/common'

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
    return {
      jwt: jwt
    }
  }

  @Get('user')
  async user(@Headers() headers) {
    try {
      if (!headers.authorization && headers.authorization == '') {
        throw new UnauthorizedException()
      }
      const jwt = headers.authorization.split('Bearer ')[1]
      const data = await this.jwtService.verifyAsync(jwt)
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
  async logout(@Headers() headers) {
    if (!headers.authorization && headers.authorization == '') {
      throw new UnauthorizedException()
    }
    return {
      message: 'success'
    }
  }

  @Post('posts')
  async createPost(
    @Body('body') body: string,
    @Headers() headers
  ) {
    try {
      if (!headers.authorization && headers.authorization == '') {
        throw new UnauthorizedException()
      }
      const jwt = headers.authorization.split('Bearer ')[1]
      const data = await this.jwtService.verifyAsync(jwt)
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
  async deletePostsByUserId(@Param("id") postId, @Headers() headers) {
    try {
      if (!headers.authorization && headers.authorization == '') {
        throw new UnauthorizedException()
      }
      const jwt = headers.authorization.split('Bearer ')[1]
      const data = await this.jwtService.verifyAsync(jwt)
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

  @Post('transactions')
  async addTransaction(
    @Body('from') from: string,
    @Body('to') to: string,
    @Body('amount') amount: string,
    @Body('type') type: string
  ) {
    return this.appService.addTransaction({ from, to, amount, type })
  }

  @Get('transactions/:address')
  async getTransaction(
    @Param('address') address: string
  ) {
    return this.appService.getTransaction(address)
  }

}
