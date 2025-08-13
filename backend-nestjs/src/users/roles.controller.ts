import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('super admin')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  async getAllRoles() {
    const roles = await this.roleService.getAllRoles();

    return {
      statusCode: '200',
      message: 'All roles are retrieved successfully.',
      data: roles,
    };
  }
}
