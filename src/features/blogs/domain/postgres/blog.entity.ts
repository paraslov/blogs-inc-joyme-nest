import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Blog } from '../business_entities/blogs'

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 15 })
  name: string

  @Column({ type: 'varchar', length: 500 })
  description: string

  @Column({ type: 'varchar', length: 100 })
  website_url: string

  @CreateDateColumn({ nullable: true })
  @Index()
  created_at: string

  @Column({ type: 'boolean', nullable: true })
  is_membership: boolean

  static createBlogModel(newBlog: Blog) {
    const createdBlogDto = new BlogEntity()

    createdBlogDto.name = newBlog.name
    createdBlogDto.description = newBlog.description
    createdBlogDto.website_url = newBlog.websiteUrl
    createdBlogDto.created_at = newBlog.createdAt
    createdBlogDto.is_membership = newBlog.isMembership

    return createdBlogDto
  }
}
