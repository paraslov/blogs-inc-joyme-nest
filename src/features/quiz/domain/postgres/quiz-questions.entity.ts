import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('quiz_questions')
export class QuizQuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column('jsonb')
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
