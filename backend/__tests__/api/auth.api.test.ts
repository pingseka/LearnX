import request from 'supertest';
import express from 'express';
import { authController } from '../../src/controllers/auth.controller';

jest.mock('../../src/models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../src/utils/password');
jest.mock('../../src/utils/jwt');

const { User: MockUser } = require('../../src/models/user.model');
const { hashPassword, comparePassword } = require('../../src/utils/password');
const { generateToken } = require('../../src/utils/jwt');

const app = express();
app.use(express.json());
app.post('/api/auth/register', ...authController.register);
app.post('/api/auth/login', ...authController.login);

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      (MockUser.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
      (MockUser.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed-password'
      });
      (generateToken as jest.Mock).mockReturnValue('mock-token');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'test123456',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(0);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return error if email already exists', async () => {
      (MockUser.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'test123456',
          name: 'Test User'
        });

      expect(response.status).toBe(500);
    });

    it('should return error if email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'test123456',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
    });

    it('should return error if password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed-password'
      };

      (MockUser.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mock-token');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(0);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'test123456' });

      expect(response.status).toBe(400);
    });

    it('should return error for wrong password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed-password'
      };

      (MockUser.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(500);
    });
  });
});