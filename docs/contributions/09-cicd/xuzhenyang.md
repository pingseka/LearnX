# CI/CD 配置贡献说明

姓名：许正扬  学号：2312190402  角色：项目负责人 / 后端  日期：2026-04-29

## 完成的工作

### 工作流相关

- [x] 拉取并审查 `.github/workflows/ci.yml`
- [x] 将 CI 拆分为 backend / frontend 两个并行 job
- [x] 为 backend job 增加 lint、coverage 测试和 Codecov 上传
- [x] 为 frontend job 保留 lint、coverage 测试并增加 Codecov 上传
- [x] 修正 README 状态徽章仓库地址为当前正式仓库 `pingseka/LearnX`
- [x] 添加 README 后端 / 前端覆盖率徽章

### 代码适配

- [x] 新增 `backend/.eslintrc.cjs`，保证后端 TypeScript 代码和测试代码可在 CI 中执行 ESLint
- [x] 调整后端 lint 命令为 `eslint src __tests__ --ext .ts --max-warnings 0`
- [x] 将前端 ESLint 配置文件改为 `eslint.config.mjs`，消除 CI/本地运行时的 Node 模块类型警告
- [x] 本地验证前端、后端测试命令与 CI 一致
- [x] 核心覆盖率达标：后端整体行覆盖率 61.36%，Service 层覆盖率 95.8%

### 可选项

- [ ] 配置 Dependabot 自动更新依赖
- [ ] 集成 CodeRabbit AI 代码审查
- [ ] 使用 act 本地验证工作流

## 本地验证

- `npm ci --prefix backend`
- `npm run lint --prefix backend`
- `npm run test:coverage --prefix backend`
- `npm ci --prefix frontend`
- `npm run lint --prefix frontend`
- `npm run test:coverage --prefix frontend`

验证结果：

- 后端 lint：通过，0 warning
- 后端测试：12 个测试套件全部通过，70 个测试全部通过
- 后端覆盖率：整体行覆盖率 61.36%，Service 层 95.8%
- 前端 lint：通过，0 warning
- 前端测试：3 个测试套件全部通过，26 个测试全部通过
- 前端覆盖率报告：已生成 `frontend/coverage/lcov.info`

## PR 链接

- PR #：待提交后填写

## CI 运行链接

- https://github.com/pingseka/LearnX/actions/runs/25096285928

## 遇到的问题和解决

1. 问题：GitHub Actions 页面显示 `The job was not started because your account is locked due to a billing issue.`  
   解决：确认该问题是原仓库所有者账号的 Billing 状态导致 job 未启动，不是 CI YAML 或测试代码报错；后续将仓库转移到可正常运行 Actions 的账号 `pingseka`，并重新触发 CI，backend 和 frontend 两个 job 均已通过。
2. 问题：README 中 CI 徽章指向 `shipeng1997/LearnX`，与当前仓库不一致。  
   解决：改为当前正式仓库 `pingseka/LearnX`，并补充 backend / frontend 两个 Codecov flag 徽章。
3. 问题：后端 `npm run lint` 缺少 ESLint 配置，CI 中无法运行 lint。  
   解决：新增 `backend/.eslintrc.cjs`，配置 TypeScript parser、Jest 环境和 CI 可用的规则。
4. 问题：前端 `eslint.config.js` 在 Node 环境下出现模块类型警告。  
   解决：改名为 `eslint.config.mjs`，显式使用 ESM 配置文件格式。

## 心得体会

这次 CI/CD 配置让我更直观地理解了“本地可运行”和“CI 可运行”的差异。CI 不只是在服务器上跑测试，还要求依赖安装、Lint、覆盖率文件路径、徽章链接和外部服务配置都一致。尤其是 GitHub Actions 因账号 Billing 状态无法启动时，需要先判断是不是代码问题，避免在 YAML 上做无效修改。

说明：仓库所有权已转移到 `pingseka/LearnX` 以保证 GitHub Actions 正常运行；本人相关提交仍使用 `xzy111222333` 作为 Git author，可通过 `git log --author="xzy111222333" --oneline` 查看。
