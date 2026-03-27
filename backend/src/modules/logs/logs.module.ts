import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [LogsService],
})
export class LogsModule {}
