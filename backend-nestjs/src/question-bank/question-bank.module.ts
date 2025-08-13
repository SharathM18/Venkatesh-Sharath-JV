import { Module } from '@nestjs/common';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './question-bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { McqQuestion } from './entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { Option } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, McqQuestion, Option, User])],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
  exports: [QuestionBankService],
})
export class QuestionBankModule {}
