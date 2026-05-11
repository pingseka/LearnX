# 安全审查贡献说明

姓名：许正扬

学号：2312190402

日期：2026-05-11

## 我完成的工作

### AI 安全审查

- **审查了哪些文件/模块**：
  - `backend/src/config/env.ts`：环境变量、JWT 密钥、AI API Key 配置
  - `backend/src/controllers/materials.controller.ts`：资料创建、更新、删除接口的访问控制
  - `backend/src/middleware/auth.middleware.ts`：JWT 鉴权中间件
  - `backend/src/controllers/auth.controller.ts`：注册、登录、用户信息接口
  - `backend/src/utils/password.ts`：密码哈希与校验
  - `backend/src/utils/jwt.ts`：Token 签发与验证
  - `.github/workflows/security.yml`：CI 密钥泄露扫描配置

- **AI 发现的主要问题**：
  1. **高危：硬编码 JWT 默认密钥**  
     `env.ts` 中原先存在 `default-secret-key` 默认值，生产环境未配置 `JWT_SECRET` 时可能导致 Token 可预测。
  2. **中危：资料接口越权访问风险**  
     `materials.controller.ts` 的更新、删除逻辑需要确认当前用户是否为资料作者，否则可能通过修改 ID 操作他人资料。
  3. **低危：错误信息与敏感配置管理**  
     需要确认 `.env` 不入库、`.env.example` 提供模板，错误处理不暴露堆栈。

- **我修复 / 参与处理了哪些问题**：
  1. 参与审查并确认 `JWT_SECRET` 已改为环境变量优先，生产环境缺失时直接阻止启动，开发环境生成临时随机密钥。
  2. 参与审查并确认资料更新、删除接口已添加资源所有权校验，非作者访问返回 403。
  3. 确认仓库已有 `backend/.env.example`，AI API Key、数据库密码、JWT Secret 等敏感配置均通过环境变量配置。
  4. 确认 CI 已新增 Gitleaks 密钥泄露扫描，安全扫描工作流已在 GitHub Actions 中通过。

### 安全检查清单

| 检查项 | 状态 | 说明 |
|-------|------|------|
| **认证与授权** | | |
| 密码存储：使用 bcrypt / argon2 哈希，不存明文 | ✅ 已完成 | `backend/src/utils/password.ts` 使用 bcrypt 进行哈希与校验 |
| JWT / Session：token 有过期时间，logout 后失效 | ✅ 部分完成 | JWT 有 `JWT_EXPIRES_IN` 过期配置；当前项目未实现服务端 logout 黑名单 |
| 接口鉴权：所有需要登录的接口都有权限校验 | ✅ 已完成 | 需要登录的资料、订单、收益等接口通过 auth middleware 保护 |
| 越权访问：用户只能操作自己的数据 | ✅ 已修复 | 资料更新、删除接口已校验作者身份 |
| **注入防护** | | |
| SQL：使用 ORM 或参数化查询，无字符串拼接 SQL | ✅ 已完成 | 项目使用 Sequelize ORM |
| XSS：前端输出用户数据时不用 innerHTML，或使用 DOMPurify | ✅ 基本完成 | React 默认转义文本输出；后续若使用富文本需单独接入 DOMPurify |
| **敏感信息** | | |
| API Key / 密码：不硬编码在代码中，通过环境变量读取 | ✅ 已完成 | DeepSeek API Key、数据库密码、JWT Secret 均从环境变量读取 |
| .env 文件：已加入 .gitignore，仓库中有 .env.example | ✅ 已完成 | `backend/.env.example` 已提供模板 |
| **依赖安全** | | |
| 运行依赖扫描，无高危漏洞（或已记录已知漏洞原因） | ✅ 已记录 | 已运行安全审查并记录依赖风险；CI 集成 Gitleaks 作为自动化安全扫描 |

### CI 安全扫描

- **配置了哪个选项（A/B/C）**：选项 A，密钥泄露扫描（Gitleaks）
- **配置文件**：`.github/workflows/security.yml`
- **扫描结果**：Security Scan 工作流已通过
- **运行链接**：https://github.com/pingseka/LearnX/actions/runs/25654364118

### 选做完成情况

- 已有基础 API rate limiting：`backend/src/app.ts` 使用 `express-rate-limit` 限制 `/api` 请求频率
- 本次未额外配置 CodeQL / CSRF / CSP，后续可作为安全增强项继续补充

## PR 链接

- 直接提交到 main：`https://github.com/pingseka/LearnX/commits/main`

## 遇到的问题和解决

1. 问题：原仓库所有者账号的 GitHub Actions 因 billing lock 无法启动。  
   解决：将正式仓库转移至可正常运行 Actions 的 `pingseka/LearnX`，保留本人提交 author 为 `xzy111222333`，并在新仓库完成 CI 与 Security Scan 验证。
2. 问题：安全审查不仅要修代码，还要证明扫描在 CI 中可持续运行。  
   解决：新增 `.github/workflows/security.yml`，使用 Gitleaks 在 push / pull_request 时自动扫描密钥泄露。

## 心得体会

Vibe Coding 能快速定位安全风险，但不能只停留在“AI 说有问题”。这次审查让我意识到安全修复需要闭环：先用 AI 从 OWASP Top 10 角度找问题，再结合项目代码确认风险，最后通过代码修复、文档记录和 CI 自动化扫描保证后续提交也能被检查。效率和安全并不矛盾，关键是把安全检查放进日常开发流程里。
