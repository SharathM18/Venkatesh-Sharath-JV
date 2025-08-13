import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Problem } from './problem.entity';
import { Language } from './language.entity';

@Entity('function_signatures')
export class FunctionSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  problemId: string;

  @Column()
  languageId: string;

  @Column('text')
  signature: string;

  // ✅ Add this: Relation to Problem
  @ManyToOne(() => Problem, (problem) => problem.functionSignatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problemId' }) // maps this field to the column
  problem: Problem;

  // ✅ Optional: Relation to Language
  @ManyToOne(() => Language, { eager: true })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}
