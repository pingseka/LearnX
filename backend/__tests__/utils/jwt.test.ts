import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/utils/jwt';
import { env } from '../../src/config/env';

jest.mock('jsonwebtoken');

describe('jwt utilities', () => {
  const mockPayload = { userId: '1', email: 'test@example.com', role: 'user' };
  const mockToken = 'mock-token-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload and options', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      
      const result = generateToken(mockPayload);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded payload', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      
      const result = verifyToken(mockToken);
      
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(result).toEqual(mockPayload);
    });

    it('should throw error for invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });
      
      expect(() => verifyToken('invalid-token')).toThrow('invalid token');
    });
  });
});