import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('邮箱已被注册');
    }

    // 哈希密码
    const hashedPassword = await hashPassword(data.password);

    // 创建新用户
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name
    });

    // 生成令牌
    const token = generateToken({
      userId: user.id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  },

  login: async (data: LoginData) => {
    // 查找用户
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 生成令牌
    const token = generateToken({
      userId: user.id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  },

  getUserById: async (userId: string) => {
    const user = await User.findByPk(Number(userId));
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }
};