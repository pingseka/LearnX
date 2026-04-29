# CI/CD 配置贡献说明

**姓名**: 施鹏  
**学号**: 2312190416  
**角色**: 前端  
**日期**: 2026-04-29

## 完成的工作

### 工作流相关
- [x] 参与编写 `.github/workflows/ci.yml`
- [x] 配置前端测试命令支持 CI 模式
- [x] 添加 README CI 状态徽章

### 代码适配
- [x] 本地测试命令与 CI 一致，配置 `--ci` 标志
- [x] 代码通过 ESLint 检查 (`--max-warnings 0`)
- [x] 核心覆盖率达标（登录页面 100%，注册页面 85%，上传页面 76%）

### CI 配置细节

**前端测试命令更新**:
```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "test": "jest --ci",
    "test:coverage": "jest --ci --coverage"
  }
}
```

**Jest 配置更新**:
```javascript
{
  testEnvironment: 'jsdom',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}']
}
```

## CI 工作流配置

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci --prefix backend
      - run: npm test --prefix backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci --prefix frontend
      - run: npm run lint --prefix frontend
      - run: npm run test:coverage --prefix frontend
```

## 遇到的问题和解决

1. **问题**: Jest 在 CI 环境中默认进入 watch 模式导致超时  
   **解决**: 在测试命令中添加 `--ci` 标志，禁用 watch 模式

2. **问题**: ESLint 在 CI 环境中报告警告导致构建失败  
   **解决**: 添加 `--max-warnings 0` 参数，将警告视为错误

3. **问题**: 覆盖率报告格式不被 Codecov 识别  
   **解决**: 在 jest.config.js 中添加 `coverageReporters: ['lcov', 'text']`

## 本地验证结果

```bash
# 前端测试全部通过
PS D:\LearnX\LearnX\frontend> npm test
Test Suites: 3 passed, 3 total
Tests: 26 passed, 26 total

# ESLint 零警告
PS D:\LearnX\LearnX\frontend> npm run lint
(无输出，零错误零警告)

# 覆盖率报告生成成功
PS D:\LearnX\LearnX\frontend> npm run test:coverage
生成 coverage/lcov.info 文件
```

## 心得体会

通过本次 CI/CD 配置，我学习到：

1. **CI 环境与本地环境的差异**：CI 环境是非交互式的，需要禁用 watch 模式、指定输出格式等
2. **缓存策略的重要性**：使用 `actions/setup-node` 的缓存功能可以大幅缩短依赖安装时间
3. **自动化检查的价值**：通过 CI 自动运行测试和 Lint，可以在代码合并前及时发现问题
4. **配置一致性**：确保本地命令与 CI 命令完全一致，避免"本地过 CI 失败"的问题

## 文件结构

```
project/
├── .github/
│   └── workflows/
│       └── ci.yml          # CI 工作流配置
├── frontend/
│   ├── package.json        # 更新测试脚本
│   └── jest.config.js      # 更新覆盖率报告配置
├── docs/
│   └── contributions/
│       └── 09-cicd/
│           └── shipeng.md  # 个人贡献说明
└── README.md               # 添加 CI 状态徽章
```