## 前端测试任务贡献报告

### 贡献者信息
- **姓名**：施鹏
- **学号**：2312190416
- **任务**：前端测试用例编写与质量保障

---

### 一、测试框架配置

#### 1. Jest 配置
配置文件：`frontend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
  ],
};
```

#### 2. 测试环境初始化
配置文件：`frontend/jest.setup.js`

```javascript
import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

---

### 二、组件测试用例（12个）

#### 1. 登录页面测试 (`app/login/page.test.tsx`)
| 测试用例 | 功能描述 |
|---------|---------|
| `renders login form with email and password fields` | 验证登录表单渲染 |
| `shows password when eye icon is clicked` | 验证密码显示/隐藏功能 |
| `submits form with valid credentials` | 验证表单提交（成功场景） |
| `submits form with invalid credentials` | 验证表单提交（失败场景） |
| `shows error when email is empty` | 验证邮箱必填校验 |
| `shows error when password is empty` | 验证密码必填校验 |
| `navigates to register page` | 验证跳转注册页面 |
| `login success redirects to dashboard` | 验证登录成功后重定向 |

#### 2. 注册页面测试 (`app/register/page.test.tsx`)
| 测试用例 | 功能描述 |
|---------|---------|
| `renders register form` | 验证注册表单渲染 |
| `shows password strength indicator` | 验证密码强度指示器 |
| `shows error when passwords do not match` | 验证密码确认校验 |
| `shows error when terms not checked` | 验证用户协议勾选校验 |

#### 3. 上传页面测试 (`app/upload/page.test.tsx`)
| 测试用例 | 功能描述 |
|---------|---------|
| `renders upload form` | 验证上传表单渲染 |
| `navigates through steps` | 验证步骤导航 |
| `AI generates description successfully` | 验证AI生成描述（成功） |
| `AI generates description with error` | 验证AI生成描述（失败） |
| `shows error when title is empty` | 验证标题必填校验 |
| `shows error when price is invalid` | 验证价格格式校验 |

---

### 三、Mock API 测试（6个）

| 测试用例 | 功能描述 |
|---------|---------|
| `login success with mock API` | Mock登录成功场景 |
| `login failure with mock API` | Mock登录失败场景 |
| `register success with mock API` | Mock注册成功场景 |
| `register failure with mock API` | Mock注册失败场景 |
| `AI description generation success` | Mock AI生成描述成功 |
| `AI description generation error` | Mock AI生成描述失败 |

---

### 四、测试运行与覆盖率

#### 运行命令
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

#### 覆盖率结果
| 模块 | 语句覆盖率 | 分支覆盖率 | 函数覆盖率 | 行覆盖率 |
|-----|----------|----------|-----------|---------|
| `app/login/` | 100% | 87.5% | 100% | 100% |
| `app/register/` | 85% | 81.25% | 90% | 86.84% |
| `app/upload/` | 75.86% | 82.69% | 61.11% | 78.57% |

---

### 五、AI 辅助测试

使用 Cursor AI 辅助生成测试用例，主要 Prompt：

1. **生成登录页面测试**
   ```
   为 Next.js 登录页面编写 React Testing Library 测试用例，包括：
   - 组件渲染测试
   - 表单交互测试
   - Mock API 测试（成功/失败场景）
   - 表单验证测试
   ```

2. **生成注册页面测试**
   ```
   为注册页面编写测试用例，关注：
   - 密码强度指示器
   - 密码确认校验
   - 用户协议勾选
   - Mock API 请求
   ```

3. **生成上传页面测试**
   ```
   为资料上传页面编写测试，包括：
   - 步骤导航测试
   - AI 生成描述功能（Mock）
   - 表单验证
   ```

---

### 六、问题与解决方案

| 问题 | 解决方案 |
|-----|---------|
| `ResizeObserver is not defined` | 在 jest.setup.js 中 Mock ResizeObserver |
| `Multiple elements found for role button` | 使用 `getAllByRole` 获取所有按钮并选择第一个 |
| `Unable to find label with text` | 检查实际组件标签文本，修正测试中的选择器 |
| `react-markdown` 模块兼容问题 | 暂时移除聊天页面测试（该模块在 Jest 环境中存在兼容性问题） |

---

### 七、文件结构

```
frontend/
├── jest.config.js          # Jest 配置
├── jest.setup.js           # 测试环境初始化
├── app/
│   ├── login/
│   │   └── page.test.tsx   # 登录页面测试
│   ├── register/
│   │   └── page.test.tsx   # 注册页面测试
│   └── upload/
│       └── page.test.tsx   # 上传页面测试
└── coverage/               # 覆盖率报告目录
```

---

### 八、完成情况

| 要求 | 完成情况 |
|-----|---------|
| 组件渲染/交互测试 ≥ 8 个 | ✅ 完成 12 个 |
| Mock API 测试 ≥ 4 个 | ✅ 完成 6 个 |
| 核心组件覆盖率 > 50% | ✅ 登录页面 100%，注册页面 85%，上传页面 76% |