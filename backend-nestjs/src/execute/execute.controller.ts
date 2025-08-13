import { Body, Controller, Post } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { RunCodeDto } from './dto/run-code.dto';
import { ValidateSubmissionDto } from './dto/validate-code.dto';
import { SubmissionService } from 'src/submissions/submission.service';
import { SubmitCodeDto } from './dto/submit-code.dto';

@Controller()
export class ExecuteController {
  constructor(
    private readonly executeService: ExecuteService,
    private readonly submissionService: SubmissionService,
  ) {}

  @Post('run-code')
  async runCode(@Body() body: RunCodeDto) {
    return this.executeService.runCode(body);
  }

  @Post('validate')
  async validateCode(@Body() dto: ValidateSubmissionDto) {
    return this.executeService.validateSubmission(dto);
  }

  @Post('submit') // final submission or auto-submission, with DB write
  submit(@Body() dto: SubmitCodeDto) {
    return this.executeService.submitCode(dto);
  }
}
