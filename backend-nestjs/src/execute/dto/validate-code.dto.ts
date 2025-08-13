import { IsIn, IsString } from 'class-validator';

export class ValidateSubmissionDto {
  @IsString()
  problemKey: string;

  @IsIn(['python', 'javascript', 'c', 'cpp', 'java', 'csharp'])
  language: 'python' | 'javascript' | 'c' | 'cpp' | 'java' | 'csharp';

  @IsString()
  userCode: string;
}
