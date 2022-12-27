import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const userId = request?.cookies.userId;

    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User does not exists!');
      }
      request.currentUser = user;
    }

    return next.handle();
  }
}
