import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import * as amqp from 'amqplib';

@Injectable()
export class LogsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async onModuleInit() {
    await this.consume();
  }

  async consume() {
    try {
      const conn = await amqp.connect('amqp://localhost');
      const channel = await conn.createChannel();
      const queue = 'user.updated';

      await channel.assertQueue(queue, { durable: true });

      console.log('RabbitMQ Consumer Started: Waiting for logs');

      channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString());

            try {
              await this.prisma.activityLog.create({
                data: payload,
              });
            } catch (dbError) {
              console.error('Fail saving to DB ActivityLog:', dbError.message);
            }

            this.gateway.sendToAdmin('user_activity', payload);

            channel.ack(msg);
          } catch (parseError) {
            console.error('Error parsing RabbitMQ message:', parseError);
            channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error('RabbitMQ Connection Error:', error);
    }
  }
}
