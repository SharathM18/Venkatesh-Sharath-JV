import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantQuestion } from 'src/applicant-questions/entities/applicant_questions.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';
import { TestAttempt } from 'src/evaluation/entities/test-attempt.entity';
import { Submission } from 'src/problem/entities/submission.entity';
import { McqQuestion } from 'src/question-bank/entities/question.entity';
import { Repository } from 'typeorm';
import { ApplicantAnswer } from './entities/applicant-answer.entity';
import { Option } from 'src/question-bank/entities/option.entity';
import { isUUID } from 'class-validator';
import { Problem } from 'src/problem/entities/problem.entity';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,

    @InjectRepository(McqQuestion)
    private questionRepo: Repository<McqQuestion>,

    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,

    @InjectRepository(ApplicantQuestion)
    private readonly applicantQuestionRepo: Repository<ApplicantQuestion>,

    @InjectRepository(ApplicantAnswer)
    private readonly answerRepo: Repository<ApplicantAnswer>,

    @InjectRepository(TestAttempt)
    private readonly testAttemptRepo: Repository<TestAttempt>,

    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,

    @InjectRepository(Problem)
    private readonly problemRepo: Repository<Problem>,
  ) {}

  async applicantResult() {
    // Step 1: Get applicants
    const applicants = await this.applicantRepo.find({
      select: ['id', 'name'],
    });

    if (!applicants.length) return [];

    // Step 2: Get question counts per applicant
    /*questionCounts:  [
    {
      applicantId: '27d60dbd-4bcb-402e-9481-4fe6a616276f',
      questionCount: '30'
    },
    {
      applicantId: 'ff2e8a22-4cfa-474d-bece-bbfa5de40e58',
      questionCount: '30'
    }
  ]
  questionMap:  {
    '27d60dbd-4bcb-402e-9481-4fe6a616276f': 30,
    'ff2e8a22-4cfa-474d-bece-bbfa5de40e58': 30
  } */
    const questionCounts = await this.applicantQuestionRepo
      .createQueryBuilder('aq')
      .select('aq.applicant_id', 'applicantId')
      .addSelect('COUNT(aq.id)', 'questionCount')
      .groupBy('aq.applicant_id')
      .getRawMany();

    const questionMap = questionCounts.reduce(
      (acc, row) => ({
        ...acc,
        [row.applicantId]: Number(row.questionCount),
      }),
      {},
    );

    // Understanding purpose
    // console.log('questionCounts: ', questionCounts);
    // console.log('questionMap: ', questionMap);

    // Step 3: Get test attempts (mcq_score)

    /*        testAttempts:  [
        { mcqScore: 20, applicantId: 'ff2e8a22-4cfa-474d-bece-bbfa5de40e58' },
        { mcqScore: 18, applicantId: '27d60dbd-4bcb-402e-9481-4fe6a616276f' }
      ]
      testAttemptMap:  {
        'ff2e8a22-4cfa-474d-bece-bbfa5de40e58': 20,
        '27d60dbd-4bcb-402e-9481-4fe6a616276f': 18
      }
           */
    const testAttempts = await this.testAttemptRepo
      .createQueryBuilder('ta')
      .select('ta.applicant_id', 'applicantId')
      .addSelect('ta.mcq_score', 'mcqScore')
      .getRawMany();

    const testAttemptMap = testAttempts.reduce(
      (acc, row) => ({
        ...acc,
        [row.applicantId]: row.mcqScore,
      }),
      {},
    );

    // Understanding purpose
    // console.log('testAttempts: ', testAttempts);
    // console.log('testAttemptMap: ', testAttemptMap);

    // Step 4: Get submissions (only status, testResults)
    /*submissions:  [
    {
      applicantId: 'ff2e8a22-4cfa-474d-bece-bbfa5de40e58',
      status: 'Failed',
      testResults: [ [Object], [Object], [Object], [Object], [Object] ]
    },
    {
      applicantId: '27d60dbd-4bcb-402e-9481-4fe6a616276f',
      status: 'Failed',
      testResults: [ [Object], [Object] ]
    }
  ]
  submissionMap:  {
    'ff2e8a22-4cfa-474d-bece-bbfa5de40e58': [ { status: 'Failed', testResults: [Array] } ],
    '27d60dbd-4bcb-402e-9481-4fe6a616276f': [ { status: 'Failed', testResults: [Array] } ]
  }
       */
    const submissions = await this.submissionRepo
      .createQueryBuilder('s')
      .select('s.applicantId', 'applicantId')
      .addSelect('s.status', 'status')
      .addSelect('s.testResults', 'testResults')
      .getRawMany();

    const submissionMap = submissions.reduce(
      (acc, row) => {
        if (!acc[row.applicantId]) acc[row.applicantId] = [];
        acc[row.applicantId].push({
          status: row.status,
          testResults: row.testResults,
        });
        return acc;
      },
      {} as Record<string, { status: string; testResults: any }[]>,
    );

    // console.log('submissions: ', submissions);
    // console.log('submissionMap: ', submissionMap);

    // Step 5: Merge everything
    return applicants.map((applicant) => ({
      id: applicant.id,
      name: applicant.name,
      questionCount: questionMap[applicant.id] ?? 0,
      mcqScore: testAttemptMap[applicant.id] ?? null,
      codingResult: submissionMap[applicant.id] ?? [],
    }));
  }

  async applicantMcqResults(applicantId: string) {
    if (!isUUID(applicantId)) {
      throw new BadRequestException(
        'Invalid applicant id format. Expected UUID.',
      );
    }

    const applicant = await this.applicantRepo.findOne({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new BadRequestException('Applicant with this id does not exists.');
    }

    const applicantQuestions = await this.applicantQuestionRepo
      .createQueryBuilder('aq')
      .leftJoinAndSelect('aq.mcq_question', 'q')
      .leftJoinAndSelect('q.options', 'options')
      .leftJoinAndMapOne(
        'aq.answer',
        'applicant_answers',
        'aa',
        'aa.mcq_question_id = q.id AND aa.applicant_id = :applicantId AND aa.test_attempt_id = aq.test_attempt_id',
        { applicantId },
      )
      .leftJoinAndSelect('aa.selected_option', 'selectedOption')
      .where('aq.applicant_id = :applicantId', { applicantId })
      .getMany();

    return applicantQuestions.map((aq: any) => ({
      questionId: aq.mcq_question.id,
      questionTitle: aq.mcq_question.questionTitle,
      difficulty: aq.mcq_question.difficulty,
      options: aq.mcq_question.options.map((o: Option) => ({
        id: o.id,
        text: o.optionText,
        isCorrect: o.isCorrect,
      })),
      status: aq.status,
      selectedOption: aq.answer?.selected_option
        ? {
            id: aq.answer.selected_option.id,
            text: aq.answer.selected_option.optionText,
            isCorrect: aq.answer.selected_option.isCorrect,
          }
        : null,
    }));
  }

  async applicantCodingResults(applicantId: string) {
    // 1. Validate UUID
    if (!isUUID(applicantId)) {
      throw new BadRequestException(
        'Invalid applicant id format. Expected UUID.',
      );
    }

    // 2. Get all submissions for the applicant
    const submissions = await this.submissionRepo.find({
      where: { applicantId },
      relations: ['applicant'], // get applicant details
      order: { createdAt: 'DESC' },
    });

    if (!submissions.length) {
      throw new BadRequestException(
        'No coding submissions found for this applicant.',
      );
    }

    // 3. Extract all problem keys
    const problemKeys = submissions.map((s) => s.problemKey);

    // 4. Fetch all problems in one query
    const problems = await this.problemRepo.find({
      where: problemKeys.map((key) => ({ key })),
    });

    const problemMap = new Map(problems.map((p) => [p.key, p]));

    // 5. Combine submissions + problem details
    return submissions.map((s) => {
      const problem = problemMap.get(s.problemKey);

      return {
        submissionId: s.id,
        createdAt: s.createdAt,
        status: s.status,
        code: s.code,
        output: s.output,
        testResults: s.testResults,
        applicant: {
          id: s.applicant.id,
          name: s.applicant.name,
          email: s.applicant.email,
        },
        problem: problem
          ? {
              key: problem.key,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
            }
          : null,
      };
    });
  }
}
