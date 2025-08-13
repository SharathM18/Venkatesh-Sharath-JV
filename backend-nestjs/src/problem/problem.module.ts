import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { FunctionSignature } from './entities/function-signature.entity';
import { FunctionName } from './entities/function-name.entity';
import { TestCase } from './entities/test-case.entity';
import { ProblemService } from './problem.service';
import { Language } from './entities/language.entity';
import { ProblemController } from './problem.controller';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { ExperienceLevel } from 'src/evaluation/entities/experience_levels.entity';
import { TestAccessToken } from 'src/evaluation/entities/test-access-token.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';
import { ApplicantQuestion } from 'src/applicant-questions/entities/applicant_questions.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Problem,
      Language,
      FunctionSignature,
      FunctionName,
      TestCase,
      Submission,
      Applicant,
      ExperienceLevel,
      TestAccessToken,
      TestAttempt,
      Job,
      Skill,
      User,
      Role,
      ApplicantQuestion,
    ]),
  ],
  providers: [ProblemService],
  controllers: [ProblemController],
  exports: [ProblemService], // ✅ so you can use it in other modules like ExecuteModule
})
export class ProblemModule {}
