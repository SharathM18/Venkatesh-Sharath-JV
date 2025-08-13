import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSubmissionDto } from 'src/execute/dto/submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.submissionService.getAllByUser(userId);
  }

  @Get('problem/:problemKey')
  async getByProblem(@Param('problemKey') problemKey: string) {
    return this.submissionService.getAllByProblem(problemKey);
  }
}
