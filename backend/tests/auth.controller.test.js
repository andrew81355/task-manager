import request from 'supertest';
import { setupTestDB } from './test-setup.js';
import app from '../index.js';
import { User } from '../models/user.js';

// Spins up in-memory Mongo and clears DB between tests
setupTestDB();

describe('Auth Controller (E2E)', () => {
  beforeAll(() => {
    // Ensure secrets exist for signing/verifying JWTs
    process.env.JWT_ACCESS_SECRET ||= 'test-access-secret';
    process.env.JWT_REFRESH_SECRET ||= 'test-refresh-secret';
  });

  beforeEach(async () => {
    // Seed one user (assumes your User schema hashes password and has comparePassword)
    await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'Passw0rd!',
      role: 'user',
      refreshVersion: 0,
    });
  });

  it('POST /auth/register -> 400 when required fields missing', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'x@y.z' }).expect(400);
    expect(res.body.message).toBe('name, email, password are required');
  });

  it('POST /auth/register -> 201 creates user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'StrongP@ss1' })
      .expect(201);

    // body should be the created user (toJSON), typically without password
    expect(res.body).toMatchObject({ name: 'Bob', email: 'bob@example.com', role: 'user' });

    const inDb = await User.findOne({ email: 'bob@example.com' }).lean();
    expect(inDb).toBeTruthy();
  });

  it('POST /auth/register -> 409 when email already exists', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Dup', email: 'alice@example.com', password: 'whatever' })
      .expect(409);

    expect(res.body.message).toBe('User already exists');
  });

  it('POST /auth/login -> 200 returns access token + refresh cookie', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Passw0rd!' })
      .expect(200);

    expect(typeof res.body.accessToken).toBe('string');
    const setCookie = res.headers['set-cookie'] || [];

    // refresh cookie should be set and scoped to /auth/refresh
    expect(setCookie.some((c) => /refreshToken=/u.test(c))).toBe(true);
    expect(setCookie.some((c) => /Path=\/auth\/refresh/u.test(c))).toBe(true);
  });

  it('POST /auth/login -> 401 on wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'WRONG' })
      .expect(401);

    expect(res.body.message).toBe('Invalid credentials');
  });

  it('GET /auth/me -> 200 with valid access token', async () => {
    // First, login to get an access token
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Passw0rd!' })
      .expect(200);

    const token = login.body.accessToken;
    const me = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.email).toBe('alice@example.com');
    expect(me.body.name).toBe('Alice');
  });

  it('GET /auth/me -> 401 without token', async () => {
    const res = await request(app).get('/auth/me').expect(401);
    expect(res.body.message).toBe('No token');
  });

  it('POST /auth/refresh -> 200 issues new access token when refresh cookie is valid', async () => {
    // Use a Supertest agent to persist cookies across requests
    const agent = request.agent(app);

    // Login to set the refresh cookie on the agent
    const login = await agent
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Passw0rd!' })
      .expect(200);

    expect(typeof login.body.accessToken).toBe('string');

    // Now refresh using the cookie stored on the agent
    const refresh = await agent.post('/auth/refresh').expect(200);
    expect(typeof refresh.body.accessToken).toBe('string');
  });

  it('POST /auth/refresh -> 401 when missing cookie', async () => {
    const res = await request(app).post('/auth/refresh').expect(401);
    expect(res.body.message).toBe('Missing refresh token');
  });

  it('POST /auth/logout -> 200 clears refresh cookie', async () => {
    const agent = request.agent(app);

    await agent
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Passw0rd!' })
      .expect(200);

    const res = await agent.post('/auth/logout').expect(200);
    expect(res.body.message).toBe('Logged out');

    const setCookie = res.headers['set-cookie'] || [];
    // Look for cleared cookie (either Max-Age=0 or expired date)
    const cleared = setCookie.some(
      (c) => /refreshToken=;/u.test(c) && (/Max-Age=0/u.test(c) || /Expires=/u.test(c))
    );
    expect(cleared).toBe(true);
  });
});
