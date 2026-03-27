import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as amqp from 'amqplib';

@Injectable()
export class LogsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.consume();
  }

  async consume() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const queue = 'user.updated';

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg) {
        const payload = JSON.parse(msg.content.toString());

        await this.prisma.activityLog.create({
          data: payload,
        });

        channel.ack(msg);
      }
    });
  }
}
