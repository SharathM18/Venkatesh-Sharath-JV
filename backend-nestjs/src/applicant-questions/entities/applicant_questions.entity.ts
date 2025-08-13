import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { McqQuestion } from 'src/question-bank/entities/question.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Option } from 'src/question-bank/entities/option.entity';
// import { Problem } from 'src/problem/entities/problem.entity';

@Entity('applicant_questions')
export class ApplicantQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Applicant, { eager: false })
  @JoinColumn({ name: 'applicant_id' })
  applicant: Applicant;

  @ManyToOne(() => McqQuestion, { eager: true })
  @JoinColumn({ name: 'mcq_question_id' })
  mcq_question: McqQuestion;

  @ManyToOne(() => TestAttempt, { eager: false })
  @JoinColumn({ name: 'test_attempt_id' })
  test_attempt: TestAttempt;

  @ManyToOne(() => Option, { eager: true, nullable: true })
  @JoinColumn({ name: 'selected_option_id' })
  selected_option: Option;

  @Column({ default: 'not_visited' })
  status: 'not_visited' | 'skipped' | 'answered';

  //   @ManyToOne(() => Problem, { eager: true }) // eager: true if you want to auto-load problem
  //   @JoinColumn({ name: 'problem_id' })
  //   problem: Problem;
}
