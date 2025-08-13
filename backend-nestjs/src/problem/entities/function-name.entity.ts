// src/problem/entities/function-name.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Problem } from './problem.entity';
import { Language } from './language.entity';

@Entity('function_names')
export class FunctionName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  problemId: string;

  @Column()
  languageId: string;

  @Column()
  name: string;

  // ✅ Add this: relation to Problem
  @ManyToOne(() => Problem, (problem) => problem.functionNames, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problemId' })
  problem: Problem;

  // ✅ Optional: relation to Language
  @ManyToOne(() => Language, { eager: true })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}
