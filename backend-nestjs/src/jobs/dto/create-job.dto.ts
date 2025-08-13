import { IsString, IsUUID } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  clientName: string;

  @IsUUID()
  createdById: string;
}
