import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "../users/users.entity"

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    body: string

    @ManyToOne(
        type => User,
        user => user.posts
    )
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}