import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getAllSkills() {
    const skills = await this.skillsService.getAllSkills();

    return {
      statusCode: '200',
      message: 'All Skills retrieved successfully.',
      data: skills,
    };
  }
}
