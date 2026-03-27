import { Injectable } from '@nestjs/common';
import { LogsService } from './logs.service';
import * as amqp from 'amqplib';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogsListener {
  constructor(
    private logsService: LogsService,
    private prisma: PrismaService,
  ) {}

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

  onModuleInit() {
    this.consume();
  }
}
