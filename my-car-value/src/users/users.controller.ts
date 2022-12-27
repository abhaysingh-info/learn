import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  Res,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Seriaize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Seriaize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.create(body)
    res.cookie('userId', user.id);
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signin(body.email, body.password);

    res.cookie('userId', user.id);
    return user;
  }

  @Post('/fake-cookie/:id')
  async fakeCookie(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('userId', id);
    return { id: parseInt(id) };
  }

  @Post('/signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('userId');
    return { userId: null, email: null, password: null, test: null };
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    return await this.usersService.find(email);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() updates: UpdateUserDto) {
    await this.usersService.update(parseInt(id), updates);

    return { success: true };
  }
}
