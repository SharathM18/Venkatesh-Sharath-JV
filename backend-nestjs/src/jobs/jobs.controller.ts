import { Body, Controller, Get, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    const job = await this.jobService.createJob(createJobDto);

    return {
      statusCode: '201',
      message: 'Job created successfully.',
      data: job,
    };
  }

  @Get()
  async getAllJobs() {
    const jobs = await this.jobService.getAllJobs();

    return {
      statusCode: '200',
      message: 'All job retrieved successfully.',
      data: jobs,
    };
  }
}
