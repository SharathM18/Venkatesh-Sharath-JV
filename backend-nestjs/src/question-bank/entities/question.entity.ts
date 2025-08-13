import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Option } from './option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mcq_questions')
export class McqQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_title' })
  questionTitle: string;

  @Column({ type: 'enum', enum: ['easy', 'medium', 'hard'] })
  difficulty: 'easy' | 'medium' | 'hard';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date;

  @ManyToOne(() => Skill, (skill) => skill.mcqQuestions)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => User, (user) => user.mcqQuestions)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(() => Option, (option) => option.mcqQuestion, {
    cascade: true,
  })
  options: Option[];
}

// cascade: true
// This means: automatically load this relation every time you load the parent entity, even without explicitly using .leftJoinAndSelect().
