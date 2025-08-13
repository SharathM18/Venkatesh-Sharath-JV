import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { ApplicantQuestionModule } from './applicant-questions/applicant-questions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/ormconfig';
import { SkillsModule } from './skills/skills.module';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { MailerModule } from './mailer/mailer.module';
import { MalpracticeModule } from './malpractice/malpractice.module';
import { ExecuteModule } from './execute/execute.module';
import { ProblemModule } from './problem/problem.module';
import { SubmissionModule } from './submissions/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    JobsModule,
    SkillsModule,
    QuestionBankModule,
    ApplicantsModule,
    ApplicantQuestionModule,
    EvaluationModule,
    MailerModule,
    MalpracticeModule,
    ProblemModule,
    ExecuteModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
