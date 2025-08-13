import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
 
export class ToggleUserStatusDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
 
  @IsEnum(['active', 'inactive'])
  @IsNotEmpty()
  status: 'active' | 'inactive';
}