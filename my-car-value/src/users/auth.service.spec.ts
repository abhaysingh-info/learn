import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let users: User[] = [];

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: async (email: string) => {
        return users.filter((user) => user.email === email);
      },
      create: async (email: string, password: string) => {
        const user = {
          id: Math.ceil(Math.random() * 999999999),
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },
      findByEmail: async (email: string) => {
        return users.filter((user) => user.email === email)[0];
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with a salted and hashed password', async () => {
    const user = await service.signup('abhay@gmail.com', 'abhay@123');

    expect(user.password).not.toEqual('abhay@123');
    const [salt, hash] = user.password.split('_');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@gmail.com', 'test@123');

    await expect(service.signup('test@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
    users = [];
  });

  it('throws an error if user signin is called with an unused email', async () => {
    await expect(
      service.signin('ahdauksjdsaikjdusuhkj@asdf.com', 'asdf'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if invalid password is provided', async () => {
    await service.signup('test@gmail.com', 'khcxzgczjhxgi');

    await expect(
      service.signin('test@gmail.com', 'treekwjdsfhjfhjndtg'),
    ).rejects.toThrow(BadRequestException);

    users = [];
  });

  it('checks if provided password is correct and matches with db password', async () => {
    const created_user = await service.signup('abhay@gmail.com', 'Abhay@123');

    fakeUsersService.findByEmail = (email: string) =>
      Promise.resolve({
        id: created_user.id,
        email: created_user.email,
        password: created_user.password,
      } as User);

    const signin_user = await service.signin('abhay@gmail.com', 'Abhay@123');

    expect(signin_user).toBeDefined();

    users = [];
  });
});
