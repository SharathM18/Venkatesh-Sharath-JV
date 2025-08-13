import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { McqQuestion } from './question.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'option_text' })
  optionText: string;

  @Column({ name: 'is_correct' })
  isCorrect: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date;

  @ManyToOne(() => McqQuestion, (mcqQuestion) => mcqQuestion.options)
  @JoinColumn({ name: 'mcq_questions_id' })
  mcqQuestion: McqQuestion;
}
