import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TestAttempt } from './test-attempt.entity';

@Entity('test_access_tokens')
export class TestAccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ default: false })
  is_used: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @ManyToOne(() => TestAttempt)
  @JoinColumn({ name: 'test_attempt_id' })
  test_attempt: TestAttempt;
}
