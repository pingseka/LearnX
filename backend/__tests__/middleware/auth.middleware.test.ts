import { authMiddleware } from '../../src/middleware/auth.middleware';
import { verifyToken } from '../../src/utils/jwt';

jest.mock('../../src/utils/jwt');

describe('authMiddleware', () => {
  const mockReq: any = {
    headers: {},
    user: null
  };

  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.headers = {};
    mockReq.user = null;
  });

  it('should call next if token is valid', () => {
    mockReq.headers.authorization = 'Bearer valid-token';
    (verifyToken as jest.Mock).mockReturnValue({
      userId: '1',
      email: 'test@example.com',
      role: 'user'
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockReq.user).toEqual({
      userId: '1',
      email: 'test@example.com',
      role: 'user'
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if no authorization header', () => {
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '未提供认证令牌' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '无效的认证令牌' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    mockReq.headers.authorization = 'Basic some-token';

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '未提供认证令牌' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});