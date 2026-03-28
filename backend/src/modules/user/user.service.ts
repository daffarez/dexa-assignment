import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { QueueService } from 'src/common/queue/queue.service';
import { UpdateProfilePayload } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    const safeUsers = users.map(({ password, ...user }) => user);

    return safeUsers;
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

  async updateProfile(userId: string, data: any) {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.role) updateData.role = data.role;
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
      message: 'User data updated successfully',
      data: safeUser,
    };
  }
}
