import { IsUUID, IsOptional, IsBoolean, IsString, IsIn } from 'class-validator';

export class SubmitCodeDto {
  @IsUUID()
  applicantId: string;

  @IsString()
  problemKey: string;

  @IsString()
  userCode: string;

  @IsIn(['python', 'javascript', 'c', 'cpp', 'java', 'csharp'])
  language: 'python' | 'javascript' | 'c' | 'cpp' | 'java' | 'csharp';

  @IsOptional()
  @IsBoolean()
  isAutoSubmitted?: boolean;
}
