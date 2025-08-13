import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  optionText: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateMcqQuestionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  skill: string; // Can be skill name or UUID based on backend logic

  @IsString()
  @IsNotEmpty()
  questionTitle: string;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsUUID()
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @ArrayMinSize(2)
  options: CreateOptionDto[];
}
