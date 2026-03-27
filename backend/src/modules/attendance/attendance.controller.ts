import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  checkIn(@Req() req: any) {
    return this.attendanceService.checkIn(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-out')
  checkOut(@Req() req: any) {
    return this.attendanceService.checkOut(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyAttendance(@Req() req: any) {
    return this.attendanceService.getMyAttendance(req.user.sub);
  }
}
