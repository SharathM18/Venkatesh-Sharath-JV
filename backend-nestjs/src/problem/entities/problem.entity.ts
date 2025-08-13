// src/problem/entities/problem.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';
import { OneToMany, ManyToOne } from 'typeorm';
import { FunctionSignature } from './function-signature.entity';
import { FunctionName } from './function-name.entity';
import { TestCase } from './test-case.entity';
import { ExperienceLevel } from 'src/evaluation/entities/experience_levels.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard'],
    //nullable: true,
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @OneToMany(() => FunctionSignature, (fs) => fs.problem)
  functionSignatures: FunctionSignature[];

  // ✅ Add this
  @OneToMany(() => FunctionName, (fn) => fn.problem)
  functionNames: FunctionName[];

  // ✅ Already likely present, but make sure
  @OneToMany(() => TestCase, (tc) => tc.problem)
  testCases: TestCase[];

  @ManyToOne(() => User, (user) => user.problems)
  @JoinColumn({ name: 'created_by' }) // This will be the column name in the DB
  createdBy: User;

  //   @ManyToOne(() => ExperienceLevel)
  // @JoinColumn({ name: 'exp_level_id' })
  // experienceLevel: ExperienceLevel;

  //   @Column()
  //   experienceLevelId: string;
}
