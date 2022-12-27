import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MessageService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessageService, MessagesRepository],
})
export class MessagesModule {}
