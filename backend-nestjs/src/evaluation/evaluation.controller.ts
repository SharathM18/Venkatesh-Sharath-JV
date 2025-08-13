import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';

@Controller('test')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('generate-link')
  async generateLink(@Body() dto: any) {
    return this.evaluationService.generateLink(dto);
  }
}
