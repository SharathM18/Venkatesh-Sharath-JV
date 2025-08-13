import { Test, TestingModule } from '@nestjs/testing';
import { MalpracticeService } from './malpractice.service';

describe('MalpracticeService', () => {
  let service: MalpracticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MalpracticeService],
    }).compile();

    service = module.get<MalpracticeService>(MalpracticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
