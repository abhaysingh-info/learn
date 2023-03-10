import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return await this.repo.save(report);
  }

  async changeApproval(id: string, approve: boolean) {
    const report = await this.repo.findOne({
      where: {
        id: parseInt(id),
      },
    });
    if (!report) {
      throw new NotFoundException('Report not found!');
    }
    report.approved = approve;
    return await this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    return await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere(`make = :make`, { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 and 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 and 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 and 3', { year: estimateDto.year })
      .orderBy('ABS(milage - :milage)', 'DESC')
      .setParameters({
        milage: estimateDto.milage,
      })
      .limit(3)
      .getRawOne();
  }
}
