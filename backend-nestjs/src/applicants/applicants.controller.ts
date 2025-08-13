import { Controller } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}
}
