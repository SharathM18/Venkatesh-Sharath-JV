import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Applicant } from 'src/evaluation/entities/applicants.entity';

@Entity('malpractices')
export class Malpractice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Applicant, (applicant) => applicant.malpractice, {
    eager: false,
  })
  @JoinColumn({ name: 'applicant_id' })
  applicant: Applicant;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @Column({ name: 'alert_message', nullable: true })
  alertMessage: string;

  @Column({ name: 'malpractice_image_url', nullable: true })
  malpracticeImageUrl: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
