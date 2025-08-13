import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';

@Entity('submission')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  applicantId: string;

  @Column()
  problemKey: string;

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'text', nullable: true })
  output: string;

  @Column()
  status: string; // "Accepted", "Wrong Answer", "Error", etc.

  @Column({ type: 'jsonb' })
  testResults: any; // array of input/output/expected

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Applicant)
  @JoinColumn({ name: 'applicantId' })
  applicant: Applicant;
}
