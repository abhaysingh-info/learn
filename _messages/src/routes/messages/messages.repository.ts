import { readFile, writeFile } from 'node:fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const messages = JSON.parse(await readFile(`messages.json`, 'utf-8'));

    return messages[id];
  }

  async findAll() {
    return JSON.parse(await readFile(`messages.json`, 'utf-8'));
  }

  async create(content: string) {
    const messages = JSON.parse(await readFile('messages.json', 'utf-8'));
    const id = Math.floor(Math.random() * 10000000);

    messages[id] = {
      content,
      id,
    };

    await writeFile('messages.json', JSON.stringify(messages));
    return { content, id };
  }
}
