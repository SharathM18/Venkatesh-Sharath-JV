// create-malpractice.dto.ts
import { IsString, IsOptional } from 'class-validator';

// create-malpractice.dto.ts
export class CreateMalpracticeDto {
  @IsString()
  applicantId: string;

  @IsString()
  @IsOptional() // Make optional for alerts
  userId?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  alertMessage?: string;

  @IsString()
  @IsOptional()
  malpracticeImageUrl?: string;
}
