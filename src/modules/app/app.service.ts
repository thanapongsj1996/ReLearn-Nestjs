import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../posts/posts.entity'
import { User } from '../users/users.entity'
import { Transaction } from '../transactions/transactions.entity'

interface inputPost {
  body: string
  userId: number
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) { }

  async addUser(data: any): Promise<User> {
    return this.userRepository.save(data)
  }

  async findUserLogin(condition: any): Promise<User> {
    return this.userRepository.findOne(condition)
  }

  async findUser(condition: any): Promise<User> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect("users.posts", "posts")
      .where(`users.id = ${condition.id}`)
      .orderBy({ 'posts.createdAt': 'DESC' })
      .getOne()
  }

  async createPost(data: inputPost) {
    const post = this.postRepository.create(data)
    return this.postRepository.save(post)
  }

  async getAllPosts() {
    return this.postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ["user"]
    })
  }

  async getPostByPostId(postId: number) {
    return this.postRepository.findOne({
      where: { id: postId },
      relations: ["user"]
    })
  }

  async getPostsByUserId(userId: number) {
    return this.postRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ["user"]
    })
  }

  async deletePostsByPostId(postId: number) {
    return this.postRepository.delete(postId)
  }

  async addTransaction(data: any) {
    return this.transactionRepository.save(data)
  }

  async getTransaction(address: string) {
    return this.transactionRepository
      .createQueryBuilder("transactions")
      .where("transactions.from = :from", { from: address })
      .orWhere("transactions.to = :to", { to: address }).getMany()
  }
}
