import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Exclude, Expose } from "class-transformer"
import { Post } from "../posts/posts.entity"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    @Exclude()
    password: string

    @OneToMany(
        type => Post,
        post => post.user
    )
    posts: Post[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}