import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@Entity('applicant_problems')
export class ApplicantProblem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Applicant, { eager: false })
  @JoinColumn({ name: 'applicant_id' })
  applicant: Applicant;

  @ManyToOne(() => TestAttempt, { eager: false })
  @JoinColumn({ name: 'test_attempt_id' })
  test_attempt: TestAttempt;

  @ManyToOne(() => Problem, { eager: true })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
