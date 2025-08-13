import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exists.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Password.');
    }

    const userJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    const token = this.jwtService.sign(userJwtPayload);

    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      status:user.status,
      role: user.role.name,
    };
    return { user: responseData, token };
  }
}
