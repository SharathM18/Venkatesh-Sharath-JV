import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MalpracticeService } from './malpractice.service';
import { MalpracticeController } from './malpractice.controller';
import { Malpractice } from './entities/malpractice.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Applicant } from 'src/evaluation/entities/applicants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Malpractice, Applicant])],
  controllers: [MalpracticeController],
  providers: [MalpracticeService, CloudinaryService],
  exports: [MalpracticeService],
})
export class MalpracticeModule {}
