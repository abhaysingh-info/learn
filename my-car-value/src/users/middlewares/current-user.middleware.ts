import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.cookies || {};
    console.log('cookie', req.cookies);
    console.log(userId);
    if (userId) {
      const user = await this.userService.findOne(parseInt(`${userId}`));

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      req.currentUser = user;
      next();
      return;
    }
  }
}
