// src/problem/entities/test-case.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Problem } from './problem.entity';

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  problemId: string;

  @Column('text')
  input: string;

  @Column('text', { name: 'expected_output' })
  expectedOutput: string;

  @Column({ default: false })
  isHidden: boolean;

  // ✅ Add this: relation to Problem
  @ManyToOne(() => Problem, (problem) => problem.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'problemId' })
  problem: Problem;
}
