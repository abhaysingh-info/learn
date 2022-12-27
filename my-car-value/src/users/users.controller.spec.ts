import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number) {
        return { id, email: 'test@123.com', password: 'test@123' } as User;
      },
      async find(email) {
        return [{ id: 1, email, password: 'test@123' } as User];
      },
      async remove(id) {
        return {
          id,
          email: 'test@123.com',
          password: 'test@gmail.com',
        } as User;
      },
    };

    fakeAuthService = {
      async signin(email, password) {
        return {
          id: 1,
          email,
          password,
        } as User;
      },
      // signup(email, password) {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = async (id: number) => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findAllUsers with given email', async () => {
    const allUsers = await controller.findAllUsers('test@123.com');
    expect(allUsers.length).toEqual(1);
    expect(allUsers[0].email === 'test@123.com').toBeTruthy();
  });

  it('signin updates session object and returns user', async () => {
    const storedCookies: any[] = [];
    const session: Partial<Response> = {
      cookie: (name: string, value: string): any => {
        storedCookies.push({ name, value });
      },
    };
    const user = await controller.signin(
      {
        email: 'test@123.com',
        password: 'abhay123',
      },
      session as Response,
    );

    expect(user.id === 1).toBeTruthy();
    expect(storedCookies.length).toEqual(1);
  });
});
