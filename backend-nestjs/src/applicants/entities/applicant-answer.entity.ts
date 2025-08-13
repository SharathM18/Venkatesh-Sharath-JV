import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { McqQuestion } from 'src/question-bank/entities/question.entity';
import { Option } from 'src/question-bank/entities/option.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';

@Entity('applicant_answers')
export class ApplicantAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Applicant)
  @JoinColumn({ name: 'applicant_id' })
  applicant: Applicant;

  @ManyToOne(() => TestAttempt)
  @JoinColumn({ name: 'test_attempt_id' })
  test_attempt: TestAttempt;

  @ManyToOne(() => McqQuestion)
  @JoinColumn({ name: 'mcq_question_id' })
  mcq_question: McqQuestion;

  @ManyToOne(() => Option)
  @JoinColumn({ name: 'selected_option_id' })
  selected_option: Option;

  @Column({ type: 'timestamp' })
  answered_at: Date;
}
