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
        avatarUrl: user.avatarUrl,
        role: user.role
      },
      token
    };
  },

  login: async (data: LoginData) => {
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 10 * 60 * 1000;

    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    if (user.lockoutTime) {
      const now = new Date();
      const lockoutEnd = new Date(user.lockoutTime);
      if (now < lockoutEnd) {
        const remainingMinutes = Math.ceil((lockoutEnd.getTime() - now.getTime()) / 60000);
        throw new Error(`账户已被锁定，请 ${remainingMinutes} 分钟后再试`);
      } else {
        user.loginAttempts = 0;
        user.lockoutTime = null;
        await user.save();
      }
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      const newAttempts = user.loginAttempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        user.loginAttempts = newAttempts;
        user.lockoutTime = new Date(Date.now() + LOCKOUT_DURATION);
        await user.save();
        throw new Error('账户已被锁定，请10分钟后再试');
      } else {
        user.loginAttempts = newAttempts;
        await user.save();
        throw new Error(`邮箱或密码错误，还剩 ${MAX_ATTEMPTS - newAttempts} 次尝试机会`);
      }
    }

    if (user.loginAttempts > 0 || user.lockoutTime) {
      user.loginAttempts = 0;
      user.lockoutTime = null;
      await user.save();
    }

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
        avatarUrl: user.avatarUrl,
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
  },

  updateProfile: async (userId: string, data: { name: string }) => {
    const user = await User.findByPk(Number(userId));
    if (!user) {
      throw new Error('用户不存在');
    }

    const name = data.name.trim();
    if (!name) {
      throw new Error('昵称不能为空');
    }

    await user.update({ name });
    return user;
  },

  updateAvatar: async (userId: string, avatarUrl: string) => {
    const user = await User.findByPk(Number(userId));
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update({ avatarUrl });
    return user;
  },

  changePassword: async (
    userId: string,
    data: { currentPassword: string; newPassword: string }
  ) => {
    const user = await User.findByPk(Number(userId));
    if (!user) {
      throw new Error('用户不存在');
    }

    const isPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('当前密码错误');
    }

    user.password = await hashPassword(data.newPassword);
    user.loginAttempts = 0;
    user.lockoutTime = null;
    await user.save();

    return { message: '密码修改成功' };
  }
};
