import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Malpractice } from './entities/malpractice.entity';
import { Applicant } from 'src/evaluation/entities/applicants.entity';

@Injectable()
export class MalpracticeService {
  constructor(
    @InjectRepository(Malpractice)
    private readonly repo: Repository<Malpractice>,
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
  ) {}

  async registerCandidate(data: {
    applicantId: string;
    profileImageUrl: string;
  }) {
    const applicant = await this.applicantRepo.findOne({
      where: { id: data.applicantId },
    });

    if (!applicant) {
      throw new BadRequestException('Applicant not found');
    }

    // Initial record with profile image (alerts null)
    const record = this.repo.create({
      applicant,
      profileImageUrl: data.profileImageUrl,
    });

    return this.repo.save(record);
  }

  async addAlert(data: {
    applicantId: string;
    alertMessage: string;
    malpracticeImageUrl: string;
  }): Promise<Malpractice> {
    // Find the first record for profile reference
    const profileRecord = await this.repo.findOne({
      where: { applicant: { id: data.applicantId } },
      order: { timestamp: 'ASC' },
      relations: ['applicant'],
    });

    if (!profileRecord) {
      throw new BadRequestException('Candidate not registered');
    }

    const alertRecord = this.repo.create({
      applicant: { id: data.applicantId } as Applicant,
      profileImageUrl: profileRecord.profileImageUrl,
      alertMessage: data.alertMessage,
      malpracticeImageUrl: data.malpracticeImageUrl,
    });

    return this.repo.save(alertRecord);
  }
}
