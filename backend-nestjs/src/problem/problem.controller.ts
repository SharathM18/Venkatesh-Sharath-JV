import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateProblemDto } from 'src/execute/dto/create-problem.dto';
import { ProblemService } from './problem.service';

@Controller()
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post('add-problem')
  async createProblem(@Body() body: CreateProblemDto) {
    return this.problemService.addProblem(body);
  }

  @Get('problems') // ✅ GET /problems
  async getAllProblems() {
    const problem = await this.problemService.getAllProblems();
    return {
      statusCode: 200,
      message: 'All problem retrieved successfully',
      data: problem,
    };
  }
}
