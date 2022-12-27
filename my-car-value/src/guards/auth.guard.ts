import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request?.cookies['userId'];

    if (!userId) {
      return false;
    }

    return true;
  }
}
