import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';

@Controller('mcq-questions')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Post()
  async createMcqQuestion(@Body() createMcqQuestionDto: CreateMcqQuestionDto) {
    const question =
      await this.questionBankService.createMcqQuestion(createMcqQuestionDto);

    return {
      statuscode: '201',
      message: 'MCQ Question created successfully',
      data: question,
    };
  }

  @Get()
  async getAllMcqQuestion() {
    const question = await this.questionBankService.getAllMcqQuestion();
    return {
      statuscode: '200',
      message: 'All MCQ Question retrieved successfully',
      data: question,
    };
  }
}
