import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ApplicantQuestionService } from './applicant-questions.service';

@Controller('applicant-questions')
export class ApplicantQuestionController {
  constructor(private readonly aqService: ApplicantQuestionService) {}

  // 1. Get all assigned questions
  @Get('assigned/:applicantId/:attemptId')
  async getAssignedQuestions(
    @Param('applicantId') applicantId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.aqService.getAssignedQuestions(applicantId, attemptId);
  }

  // 2. Save or update an answer
  @Post('answer')
  async saveAnswer(
    @Body()
    body: {
      applicantId: string;
      attemptId: string;
      questionId: string;
      selectedOptionId: string;
    },
  ) {
    const { applicantId, attemptId, questionId, selectedOptionId } = body;
    return this.aqService.saveAnswer(
      applicantId,
      attemptId,
      questionId,
      selectedOptionId,
    );
  }

  // 3. Get all answers
  @Get('answers/:applicantId/:attemptId')
  async getAnswers(
    @Param('applicantId') applicantId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.aqService.getAnswers(applicantId, attemptId);
  }

  // 4. Get last answered question
  @Get('resume/:applicantId/:attemptId')
  async getLastAnswered(
    @Param('applicantId') applicantId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.aqService.resumeTest(applicantId, attemptId);
  }

  // 5. Evaluate test
  @Get('evaluate/:applicantId/:attemptId')
  async evaluate(
    @Param('applicantId') applicantId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.aqService.evaluateTest(applicantId, attemptId);
  }

  // 6. Skip a question
  @Patch('skip')
  async skipQuestion(
    @Body()
    body: {
      applicantId: string;
      attemptId: string;
      questionId: string;
    },
  ) {
    const { applicantId, attemptId, questionId } = body;
    return this.aqService.skipQuestion(applicantId, attemptId, questionId);
  }

  @Get('start/:applicantId/:attemptId/:languageId')
  async startOrFetchProblem(
    @Param('applicantId') applicantId: string,
    @Param('attemptId') attemptId: string,
    @Param('languageId') languageId: string,
  ) {
    if (!languageId || typeof languageId !== 'string') {
      throw new BadRequestException('languageId must be a UUID string');
    }

    try {
      const fetched = await this.aqService.getAssignedProblem(
        applicantId,
        attemptId,
        languageId,
      );
      return { status: 'already_assigned', ...fetched };
    } catch (error) {
      if (error.status === 404) {
        await this.aqService.assignProblem(applicantId, attemptId);
        const assigned = await this.aqService.getAssignedProblem(
          applicantId,
          attemptId,
          languageId,
        );
        return { status: 'newly_assigned', ...assigned };
      } else {
        throw error;
      }
    }
  }
}
