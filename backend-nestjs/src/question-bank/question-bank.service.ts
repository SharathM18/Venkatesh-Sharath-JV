import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';
import { isUUID } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { McqQuestion } from './entities/question.entity';
import { Option } from './entities/option.entity';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(McqQuestion)
    private readonly mcqQuestionRepo: Repository<McqQuestion>,

    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async createMcqQuestion(createMcqQuestionDto: CreateMcqQuestionDto) {
    const { skill, createdBy, questionTitle, difficulty, options } =
      createMcqQuestionDto;

    let skillEntity: Skill | null;

    if (isUUID(skill)) {
      skillEntity = await this.skillRepo.findOne({ where: { id: skill } });
      if (!skillEntity) {
        throw new NotFoundException('Skill UUID not found');
      }
    } else {
      skillEntity = await this.skillRepo.findOne({ where: { name: skill } });
      if (!skillEntity) {
        skillEntity = await this.skillRepo.save(
          this.skillRepo.create({ name: skill }),
        );
      }
    }

    // Validate created_by user
    const user = await this.userRepo.findOne({ where: { id: createdBy } });
    if (!user) {
      throw new NotFoundException('CreatedBy (user) ID is invalid');
    }

    // Create question
    const question = this.mcqQuestionRepo.create({
      questionTitle: questionTitle,
      difficulty,
      skill: skillEntity,
      createdBy: user,
    });

    const savedQuestion = await this.mcqQuestionRepo.save(question);

    // Create options
    const optionsToSave = options.map((opt) =>
      this.optionRepo.create({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        mcqQuestion: savedQuestion,
      }),
    );

    await this.optionRepo.save(optionsToSave);

    return {
      questionId: savedQuestion.id,
    };
  }

  async getAllMcqQuestion() {
    const questions = await this.mcqQuestionRepo
      .createQueryBuilder('mcqQuestion')
      .leftJoinAndSelect('mcqQuestion.skill', 'skill')
      .leftJoinAndSelect('mcqQuestion.options', 'option')
      .leftJoinAndSelect('mcqQuestion.createdBy', 'creator')
      .select([
        'mcqQuestion.id',
        'mcqQuestion.questionTitle',
        'mcqQuestion.difficulty',
        'mcqQuestion.createdAt',
        'mcqQuestion.modifiedAt',
        'creator.name',
        'skill.id',
        'skill.name',
        'mcqQuestion.createdBy',
        'option.id',
        'option.optionText',
        'option.isCorrect',
      ])
      .getMany();

    return questions.map((question) => ({
      id: question.id,
      questionTitle: question.questionTitle,
      difficulty: question.difficulty,
      createdAt: question.createdAt,
      modifiedAt: question.modifiedAt,
      createdBy: question.createdBy?.name || null,
      skill: {
        id: question.skill?.id,
        name: question.skill?.name,
      },
      options: question.options?.map((opt) => ({
        id: opt.id,
        text: opt.optionText,
        isCorrect: opt.isCorrect,
      })),
    }));
  }
}
