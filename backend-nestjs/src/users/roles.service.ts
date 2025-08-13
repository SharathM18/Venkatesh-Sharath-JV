import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getAllRoles() {
    const roles = await this.roleRepo.find({
      select: ['id', 'name'],
    });

    if (roles.length === 0) {
      throw new BadRequestException('No roles found.');
    }

    return roles;
  }
}
