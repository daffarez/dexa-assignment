import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsListener } from './logs.listener';

@Module({
  providers: [LogsService, LogsListener],
})
export class LogsModule {}
