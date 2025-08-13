import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  async getAllSkills() {
    const skills = await this.skillRepo.find({ select: ['id', 'name'] });

    if (skills.length === 0) {
      throw new BadRequestException('No roles found.');
    }

    return skills;
  }
}
