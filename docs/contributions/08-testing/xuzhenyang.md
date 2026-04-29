# 软件测试贡献说明

姓名：许正扬  学号：2312190402  角色：后端（AI 模块测试）  日期：2026-04-28

## 完成的测试工作

### 测试文件

- `backend/__tests__/services/ai.service.test.ts`
- `backend/__tests__/api/ai.api.test.ts`

### 测试清单

- [x] 正常情况测试（5 个）：AI 聊天成功、生成资料描述成功、DeepSeek 客户端配置、Ollama 客户端配置、API 正常响应
- [x] 边界 / 异常情况测试（8 个）：AI 响应为空、缺少 API Key、生成描述为空、缺少 messages、非法 role、Service 异常、缺少 title、缺少 category
- [x] Mock 使用：Mock OpenAI 兼容客户端，Mock `aiService` 隔离外部 API 与 Service 层依赖

### 覆盖率

- 运行命令：`cd backend && npm run test:coverage`
- 测试结果：12 个测试套件全部通过，70 个测试全部通过
- 后端整体行覆盖率：61.36%
- 后端 Service 层覆盖率：95.8%
- `ai.service.ts` 覆盖率：100%
- `ai.controller.ts` 覆盖率：95.45%

### AI 辅助

- 使用工具：Codex
- Prompt 示例：为项目测试作业检查我还需要做什么，并根据我负责的 AI/DeepSeek 模块补充后端单元测试和 API 测试，要求使用 Mock 隔离外部 OpenAI/DeepSeek API，覆盖正常、参数校验和异常场景。
- AI 生成 + 人工修改的测试数量：13 个

## PR 链接

- PR #：待提交后填写

## 遇到的问题和解决

1. 问题：测试不能真实调用 DeepSeek/OpenAI 接口，否则依赖网络和 API Key。  
   解决：在 `ai.service.test.ts` 中 Mock `openai` 包，只验证请求参数和返回处理逻辑。
2. 问题：AI 配置来自环境变量，缺少 API Key 时需要有明确错误。  
   解决：Mock `env` 配置对象，分别覆盖 DeepSeek 云端配置、Ollama 本地配置和 API Key 缺失场景。
3. 问题：API 测试需要覆盖参数校验但不能调用真实 Service。  
   解决：在 `ai.api.test.ts` 中 Mock `aiService`，直接测试 Controller 的响应格式、状态码和错误处理中间件。

## 心得体会

这次补充 AI 模块测试后，我更清楚地理解了单元测试和接口测试的边界：Service 层重点验证业务逻辑和外部 API 调用参数，API 层重点验证请求校验、状态码和统一响应格式。通过 Mock 外部 AI 服务，测试可以稳定运行，也避免了把 API Key 和网络状态引入测试流程。
