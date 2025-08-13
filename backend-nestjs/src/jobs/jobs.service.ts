import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createJob(createJobDto: CreateJobDto) {
    const { title, clientName, createdById } = createJobDto;

    const user = await this.userRepo.findOne({ where: { id: createdById } });
    if (!user) {
      throw new NotFoundException('CreatedBy (user) ID is invalid');
    }

    const job = this.jobRepo.create({
      title,
      clientName,
      createdBy: user,
    });
    const savedJob = await this.jobRepo.save(job);

    return { jobId: savedJob.id };
  }

  async getAllJobs() {
    const jobs = await this.jobRepo
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .select([
        'job.id',
        'job.title',
        'job.clientName',
        'job.createdAt',
        'user.name',
      ])
      .getMany();

    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      createdAt: job.createdAt,
      createdBy: job.createdBy?.name,
    }));
  }
}
