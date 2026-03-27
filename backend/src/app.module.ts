import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogsModule } from './modules/logs/logs.module';
import { QueueModule } from './common/queue/queue.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { NotificationsGateway } from './modules/notifications/notifications.gateway';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    LogsModule,
    QueueModule,
    AttendanceModule,
    NotificationsModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}
