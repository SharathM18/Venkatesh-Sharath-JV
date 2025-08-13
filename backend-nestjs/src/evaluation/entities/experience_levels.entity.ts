import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('experience_levels')
export class ExperienceLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('int')
  min_year: number;

  @Column('int')
  max_year: number;
}
