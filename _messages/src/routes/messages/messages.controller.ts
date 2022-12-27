import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessageService) {}

  @Get('')
  async listMessages() {
    return await this.messageService.findAll();
  }

  @Post('')
  async createMessage(@Body() body: CreateMessageDto) {
    const result = await this.messageService.create(body.content);
    return { success: true, result };
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const message = await this.messageService.findOne(id);
    if (!message) {
      throw new NotFoundException('message not found');
    }

    return message;
  }
}
