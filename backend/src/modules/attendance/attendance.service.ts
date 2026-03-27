import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueueService } from 'src/common/queue/queue.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  async checkIn(userId: string) {
    const { start, end } = this.getTodayRange();

    const existing = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existing?.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkIn: new Date(),
        },
      });
    }

    return this.prisma.attendance.create({
      data: {
        userId,
        date: new Date(),
        checkIn: new Date(),
      },
    });
  }

  async checkOut(userId: string) {
    const { start, end } = this.getTodayRange();

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!attendance || !attendance.checkIn) {
      throw new BadRequestException('You must check in first');
    }

    if (attendance.checkOut) {
      throw new BadRequestException('Already checked out');
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: new Date(),
      },
    });
  }

  async getMyAttendance(userId: string) {
    const data = await this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return data.flatMap((item) => this.formatAttendance(item));
  }

  private formatAttendance(attendance: any) {
    const result: any[] = [];

    if (attendance.checkIn) {
      result.push({
        date: attendance.date,
        time: attendance.checkIn,
        status: 'MASUK',
      });
    }

    if (attendance.checkOut) {
      result.push({
        date: attendance.date,
        time: attendance.checkOut,
        status: 'PULANG',
      });
    }

    return result;
  }
}
