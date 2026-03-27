import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as amqp from 'amqplib';
import { QueueService } from 'src/common/queue/queue.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateProfile(userId: string, data: any) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    await this.queueService.publish('user.updated', {
      userId,
      action: 'UPDATE_PROFILE',
      data,
    });

    return updatedUser;
  }
}
