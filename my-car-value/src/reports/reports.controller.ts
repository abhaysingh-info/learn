import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Seriaize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin-guard/admin-guard.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Seriaize(ReportDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return await this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportsService.changeApproval(id, body.approve);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
