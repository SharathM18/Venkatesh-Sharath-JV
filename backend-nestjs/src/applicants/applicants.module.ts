import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { MalpracticeModule } from 'src/malpractice/malpractice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAccessToken } from 'src/evaluation/entities/test-access-token.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { ApplicantQuestion } from 'src/applicant-questions/entities/applicant_questions.entity';
import { Submission } from 'src/problem/entities/submission.entity';
import { McqQuestion } from 'src/question-bank/entities/question.entity';
import { Option } from 'src/question-bank/entities/option.entity';
import { ApplicantAnswer } from './entities/applicant-answer.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applicant,
      McqQuestion,
      Option,
      ApplicantQuestion,
      ApplicantAnswer,
      TestAttempt,
      Submission,
      Problem,
    ]),
    MalpracticeModule,
  ],
  providers: [ApplicantsService],
  controllers: [ApplicantsController],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
