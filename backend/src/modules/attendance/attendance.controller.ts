import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { type RequestWithUser } from '../../common/guards/jwt-payload.types';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  checkIn(@Req() req: RequestWithUser) {
    return this.attendanceService.checkIn(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-out')
  checkOut(@Req() req: RequestWithUser) {
    return this.attendanceService.checkOut(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyAttendance(@Req() req: RequestWithUser) {
    return this.attendanceService.getUserAttendance(req.user.id);
  }

  @Get('user/:userId')
  async getUserAttendance(@Param('userId') userId: string) {
    return this.attendanceService.getUserAttendance(userId);
  }
}
