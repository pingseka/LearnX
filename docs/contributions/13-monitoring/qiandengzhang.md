# 监控配置贡献说明

姓名：钱登涨<br>
学号：2207090524<br>
日期：2026-06-01

## 我完成的工作

### 1. 请求日志与链路追踪

- [x] 实现结构化 JSON 日志（含 timestamp、level、service、environment 字段）
- [x] 请求日志记录方法、路径、状态码和响应耗时
- [x] 每次请求生成唯一 requestId，通过 `X-Request-Id` 响应头返回
- [x] 异常日志保留错误 name、message 和完整调用栈

### 2. 指标收集

- [x] 实现内存级指标收集（请求总数、失败数、错误率、平均响应时间）
- [x] 指标通过 `/metrics` 端点暴露，使用 Bearer Token 保护
- [x] 监控 Token 使用 `timingSafeEqual` 常量时间比较，防止时序攻击
- [x] 生产环境强制要求 Token，开发环境允许无 Token 访问

### 3. 安全监控

- [x] 配置 `express-rate-limit` 全局限频（15 分钟内最多 100 请求）
- [x] 添加安全 HTTP 响应头（X-Frame-Options、CSP、HSTS 等）并记录违规尝试
- [x] 数据库查询日志接入结构化日志，便于排查慢查询

### 4. 容器健康检查

- [x] 后端容器配置 Docker HEALTHCHECK（wget `/health`，10s 间隔，3 次重试）
- [x] 前端容器通过 `depends_on` 等待后端健康就绪后再启动


## 遇到的问题和解决

1. 问题：`express-rate-limit` 默认返回 HTML 格式的 429 页面，前端无法解析。<br>
   解决：自定义限频响应为 JSON 格式 `{ code: 1, msg: '...' }`，前端可统一处理。

2. 问题：`/metrics` 端点暴露内部运行数据，存在信息泄露风险。<br>
   解决：使用 Bearer Token 认证 + `timingSafeEqual` 常量时间比较，避免时序旁路攻击。

## 心得体会

监控不只是"看看系统有没有挂"，更重要的是在问题发生的第一时间就能定位根因。结构化的 JSON 日志配合 requestId 可以追踪一个请求的完整链路，metrics 端点让运维人员能快速判断系统健康状态。安全监控（限频、安全头）则是在防护层面的另一道防线。
