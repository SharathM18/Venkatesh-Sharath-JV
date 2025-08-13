import {
  IsUUID,
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from 'class-validator';

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('IN')
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsEnum(UserStatus, {
    message: 'Status must be either active or inactive',
  })
  status: UserStatus;

  @IsUUID()
  roleId: string;
}
