import { PartialType } from '@nestjs/swagger'; // Changed from @nestjs/mapped-types
import { CreateMalpracticeDto } from './create-malpractice.dto';

export class UpdateMalpracticeDto extends PartialType(CreateMalpracticeDto) {}