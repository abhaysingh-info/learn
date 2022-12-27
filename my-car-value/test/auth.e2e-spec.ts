import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request /auth/signup (POST)', async () => {
    let _email = `testdsfdsljfdsjl${Math.ceil(
      Math.random() * 99999999,
    )}@gmail.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: _email,
        password: 'test@123',
      })
      .expect(201);

    const { id, email } = res?.body;

    expect(id).toBeDefined();
    expect(email).toEqual(_email);
  });

  it('signup as new user then get the current loggedin user', async () => {
    const email = 'test@hello.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'test@gmail.com' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
