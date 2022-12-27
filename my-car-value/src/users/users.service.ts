import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.user.create({ email, password });

    return await this.user.save(user);
  }

  async findOne(id: number) {
    const user = await this.user.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    if (!email) {
      return null;
    }
    const user: User | null = await this.user.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async find(email: string) {
    return await this.user.find({ where: { email: email } });
  }

  async update(id: number, updates: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, updates);
    return await this.user.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return await this.user.remove(user);
  }
}
