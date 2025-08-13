// DTO for addAlert
import { IsString } from 'class-validator';

export class AddAlertDto {
  @IsString()
  applicantId: string;

  @IsString()
  alertMessage: string;
}
