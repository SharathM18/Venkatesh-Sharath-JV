import { Controller, Get, Param } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Get('results')
  async applicantResult() {
    const result = await this.applicantsService.applicantResult();

    return {
      statusCode: '200',
      message: 'All applicant result retrieved successfully.',
      data: result,
    };
  }

  @Get('results/mcqs/:applicantId')
  async applicantMcqResults(@Param('applicantId') applicantId: string) {
    const result =
      await this.applicantsService.applicantMcqResults(applicantId);

    return {
      statusCode: '200',
      message: 'Applicant mcqs results is retrieved successfully.',
      data: result,
    };
  }

  @Get('results/coding/:applicantId')
  async applicantCodingResults(@Param('applicantId') applicantId: string) {
    const result =
      await this.applicantsService.applicantCodingResults(applicantId);

    return {
      statusCode: '200',
      message: 'Applicant coding results is retrieved successfully.',
      data: result,
    };
  }
}
