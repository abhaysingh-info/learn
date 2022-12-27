import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'node:crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private passwordAndSaltSeperator = '_';

  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('Email in use');
    }
    // Hash users password
    let hashedPassword = await this.hashPassword(password);
    // create new user and save it

    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    // hashed password
    const [salt, existingPassword] = user.password.split(
      this.passwordAndSaltSeperator,
    );

    const hashedPassword = (await this.scryptHash(password, salt)).toString(
      'hex',
    );

    if (hashedPassword !== existingPassword) {
      throw new BadRequestException('Bad Password');
    }

    return user;
  }

  private getRandomBytes(len: number) {
    return randomBytes(len).toString('hex');
  }

  private async hashPassword(password: string) {
    const salt = this.getRandomBytes(20);
    const hash = await this.scryptHash(password, salt);
    return `${salt}${this.passwordAndSaltSeperator}${hash.toString('hex')}`;
  }

  private async scryptHash(str: string, salt: string, length: number = 152) {
    return (await scrypt(str, salt, length)) as Buffer;
  }
}
