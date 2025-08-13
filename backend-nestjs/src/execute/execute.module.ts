import { Module } from '@nestjs/common';
import { ExecuteController } from './execute.controller';
import { ExecuteService } from './execute.service';
import { ProblemModule } from 'src/problem/problem.module';
import { SubmissionModule } from 'src/submissions/submission.module';
@Module({
  imports:[ ProblemModule,SubmissionModule],
  controllers: [ExecuteController],
  providers: [ExecuteService],
})
export class ExecuteModule {}