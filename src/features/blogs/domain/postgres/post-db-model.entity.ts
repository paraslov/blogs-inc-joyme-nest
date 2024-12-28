import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BlogDbModel } from './blog-db-model.entity'
import { PostEntity } from '../business_entities/posts'

@Entity('posts')
export class PostDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 30 })
  title: string

  @Column({ type: 'varchar', length: 100 })
  short_description: string

  @Column({ type: 'varchar', length: 1000 })
  content: string

  @Column({ type: 'uuid' })
  blog_id: string

  @Column({ type: 'varchar', length: 15 })
  blog_name: string

  @CreateDateColumn({ nullable: true })
  created_at?: string

  @Column({ type: 'integer', nullable: true })
  likes_count?: number

  @Column({ type: 'integer', nullable: true })
  dislikes_count?: number

  @ManyToOne(() => BlogDbModel)
  @JoinColumn({ name: 'blog_id' })
  blog: BlogDbModel

  static createPostModel(newPost: PostEntity) {
    const createdPostDto = new PostDbModel()

    createdPostDto.title = newPost.title
    createdPostDto.short_description = newPost.shortDescription
    createdPostDto.content = newPost.content
    createdPostDto.blog_id = newPost.blogId
    createdPostDto.blog_name = newPost.blogName
    createdPostDto.created_at = newPost.createdAt
    createdPostDto.likes_count = newPost.likesCount
    createdPostDto.dislikes_count = newPost.dislikesCount

    return createdPostDto
  }
}
