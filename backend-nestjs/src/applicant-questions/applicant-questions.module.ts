import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantQuestion } from './entities/applicant_questions.entity';
import { ApplicantQuestionService } from './applicant-questions.service';
import { ApplicantQuestionController } from './applicant-questions.controller';
import { Option } from 'src/question-bank/entities/option.entity';
import { ApplicantAnswer } from 'src/applicants/entities/applicant-answer.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { TestAccessToken } from 'src/evaluation/entities/test-access-token.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { EvaluationModule } from 'src/evaluation/evaluation.module';
import { Problem } from 'src/problem/entities/problem.entity';
import { ApplicantProblem } from './entities/applicant_problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Problem,
      ApplicantQuestion,
      ApplicantProblem,
      ApplicantAnswer,
      Option,
      TestAttempt,
      TestAccessToken,
      Applicant,
    ]),
    EvaluationModule,
  ],
  controllers: [ApplicantQuestionController],
  providers: [ApplicantQuestionService],
  exports: [ApplicantQuestionService],
})
export class ApplicantQuestionModule {}
