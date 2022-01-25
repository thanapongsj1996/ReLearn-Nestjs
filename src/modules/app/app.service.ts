import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../posts/posts.entity'
import { User } from '../users/users.entity'

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
    private readonly postRepository: Repository<Post>
  ) { }

  async addUser(data: any): Promise<User> {
    return this.userRepository.save(data)
  }

  async findUser(condition: any): Promise<User> {
    return this.userRepository.findOne(condition)
  }

  async createPost(data: inputPost) {
    const post = this.postRepository.create(data)
    return this.postRepository.save(post)
  }

  async getAllPosts() {
    return this.postRepository.find({
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
      relations: ["user"]
    })
  }

  async deletePostsByPostId(postId: number) {
    return this.postRepository.delete(postId)
  }
}
