import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('super admin')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    return {
      statusCode: '201',
      message: 'User created successfully.',
      data: user,
    };
  }

  @Get()
  async getAllUser() {
    const user = await this.userService.getAllUser();

    return {
      statusCode: '200',
      message: 'All users are retrieved successfully.',
      data: user,
    };
  }


  @Put('toggle-status')
  async toggleUserStatus(@Body() toggleUserStatusDto: ToggleUserStatusDto) {
    const userStatus =
      await this.userService.toggleUserStatus(toggleUserStatusDto);

    return {
      statusCode: '200',
      message: 'Status changed successfully.',
      data: userStatus,
    };
  }
}
