import { User } from '../../src/models/user.model';
import { authService } from '../../src/services/auth.service';
import { hashPassword, comparePassword } from '../../src/utils/password';
import { generateToken } from '../../src/utils/jwt';

jest.mock('../../src/models/user.model');
jest.mock('../../src/utils/password');
jest.mock('../../src/utils/jwt');

describe('authService', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    password: 'hashed-password'
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'test123456',
        name: 'Test User'
      });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('test123456');
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User'
      });
      expect(generateToken).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
        role: 'user'
      });
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: mockToken
      });
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register({
        email: 'test@example.com',
        password: 'test123456',
        name: 'Test User'
      })).rejects.toThrow('邮箱已被注册');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'test123456'
      });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(comparePassword).toHaveBeenCalledWith('test123456', 'hashed-password');
      expect(generateToken).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
        role: 'user'
      });
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: mockToken
      });
    });

    it('should throw error if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login({
        email: 'notfound@example.com',
        password: 'test123456'
      })).rejects.toThrow('邮箱或密码错误');
    });

    it('should throw error if password is incorrect', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('邮箱或密码错误');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getUserById('1');

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(authService.getUserById('999')).rejects.toThrow('用户不存在');
    });
  });
});