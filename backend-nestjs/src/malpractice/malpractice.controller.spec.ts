import { Test, TestingModule } from '@nestjs/testing';
import { MalpracticeController } from './malpractice.controller';

describe('MalpracticeController', () => {
  let controller: MalpracticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MalpracticeController],
    }).compile();

    controller = module.get<MalpracticeController>(MalpracticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
