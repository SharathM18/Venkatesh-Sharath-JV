import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { MalpracticeModule } from 'src/malpractice/malpractice.module';

@Module({
  imports:[MalpracticeModule],
  providers: [ApplicantsService],
  controllers: [ApplicantsController],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
