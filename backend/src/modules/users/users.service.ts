import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { QueueService } from 'src/common/queue/queue.service';
import { UpdateProfilePayload } from './users.schema';

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
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;

    return result;
  }

  async updateProfile(userId: string, data: UpdateProfilePayload) {
    const updateData: UpdateProfilePayload = {};

    if (data.phone) updateData.phone = data.phone;
    if (data.photoUrl) updateData.photoUrl = data.photoUrl;

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password, ...safeUser } = user;

    await this.queueService.publish('user.updated', {
      userId,
      action: 'UPDATE_PROFILE',
      data: safeUser,
    });

    return {
      message: 'Profile updated successfully',
      data: safeUser,
    };
  }
}
