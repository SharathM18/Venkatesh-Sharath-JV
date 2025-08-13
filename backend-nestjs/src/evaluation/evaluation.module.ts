import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { Applicant } from './entities/applicants.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { McqQuestion } from 'src/question-bank/entities/question.entity';
import { TestAttempt } from './entities/test-attempt.entity';
import { TestAccessToken } from './entities/test-access-token.entity';
import { ApplicantQuestion } from 'src/applicant-questions/entities/applicant_questions.entity';
import { ExperienceLevel } from './entities/experience_levels.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applicant,
      Skill,
      McqQuestion,
      TestAttempt,
      TestAccessToken,
      ApplicantQuestion,
      ExperienceLevel,
      Job,
    ]),
    MailerModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
