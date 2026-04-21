# AI 功能集成贡献说明

姓名：许正扬
学号：2312190402
日期：2026-04-21

## 我完成的工作

### 1. AI 功能

- 功能类型：智能客服（基于上下文的多轮问答）
- 使用模型：DeepSeek（`deepseek-chat`，云端 API）

### 2. 实现内容

- [x] 后端 AI 服务重构：将 `ai.service.ts` 从硬编码 Ollama 改为通过环境变量动态选择提供商
- [x] 环境变量扩展：在 `config/env.ts` 中添加 `AI_PROVIDER`、`AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL`
- [x] DeepSeek API 接入：支持 DeepSeek 云端 API（`https://api.deepseek.com/v1`）
- [x] Ollama 兼容保留：通过切换 `AI_PROVIDER=ollama` 仍可使用本地模型
- [x] API Key 安全管理：Key 通过 `.env` 管理，已在 `.gitignore` 中忽略，不提交仓库
- [x] 错误处理：未配置 API Key 时给出明确错误提示
- [x] 文档更新：更新 `docs/ai-feature.md`，说明双提供商配置方式

## PR 链接

- PR #: （提交 PR 后填写）

## 心得体会

通过本次 AI 功能集成，我了解了 OpenAI 兼容接口的设计理念——不同提供商（DeepSeek、Ollama、OpenAI）
都遵循相同的 API 格式，只需切换 `baseURL` 和 `apiKey` 即可无缝替换。
将配置抽离到环境变量中，既保证了 API Key 的安全性，也让项目在云端和本地环境间灵活切换，
避免了为不同场景维护多份代码的问题。
