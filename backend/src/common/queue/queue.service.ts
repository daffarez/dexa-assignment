import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService implements OnModuleInit {
  private channel: amqp.Channel;

  async onModuleInit() {
    const conn = await amqp.connect('amqp://localhost');
    this.channel = await conn.createChannel();
  }

  async publish(queue: string, message: any) {
    await this.channel.assertQueue(queue, { durable: true });

    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
}
