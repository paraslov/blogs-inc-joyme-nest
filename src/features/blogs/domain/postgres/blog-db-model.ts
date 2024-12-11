import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('blogs')
export class BlogDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 15 })
  name: string

  @Column({ type: 'varchar', length: 500 })
  description: string

  @Column({ type: 'varchar', length: 100 })
  website_url: string

  @CreateDateColumn({ nullable: true })
  created_at: string

  @Column({ type: 'boolean', nullable: true })
  is_membership: boolean
}
