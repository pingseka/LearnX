# 基础监控配置说明

> 负责人：许正扬<br>
> 学号：2312190402

## 1. 监控范围

LearnX 后端已经实现结构化日志、健康检查和基础指标查询。

| 能力 | 地址或位置 | 用途 |
| --- | --- | --- |
| JSON 日志 | `docker compose logs backend` | 查询请求和异常 |
| 健康检查 | `GET /health` | 判断服务和数据库是否可用 |
| 基础指标 | `GET /metrics` | 查询请求数、响应时间和错误率 |

## 2. 结构化日志

后端日志按 JSON 输出，便于腾讯云日志服务或命令行检索。

```json
{
  "timestamp": "2026-06-01T12:00:00.000Z",
  "level": "info",
  "service": "learnx-backend",
  "message": "http_request",
  "method": "GET",
  "path": "/api/materials",
  "statusCode": 200,
  "durationMs": 18.42
}
```

查看日志：

```bash
docker compose --env-file .env -f compose.prod.yaml logs --tail=100 backend
```

## 3. 健康检查

```bash
curl https://你的域名/health
```

健康检查会真实验证 SQLite 数据库连接。数据库可用时返回 `200` 和
`healthy`；数据库异常时返回 `503` 和 `unhealthy`。

例如数据库 volume 无法读取时，不会伪装成健康状态，Docker 会根据
`503` 判断后端容器异常。

## 4. 基础指标

生产环境的 `/metrics` 必须携带令牌：

```bash
curl \
  -H "Authorization: Bearer 你的监控令牌" \
  https://你的域名/metrics
```

返回内容包括：

```json
{
  "requests": {
    "total": 120,
    "failed": 2,
    "errorRate": 0.02,
    "averageResponseTimeMs": 36.48
  }
}
```

其中 `failed` 统计 HTTP `500` 及以上错误。比如 120 次请求中有 2 次
数据库错误，错误率就是 `0.02`，也就是 2%。

## 5. 基础告警建议

可以在腾讯云监控或定时脚本中配置：

| 告警 | 条件 | 处理方式 |
| --- | --- | --- |
| 服务不可用 | `/health` 连续 3 次不是 `200` | 检查后端日志和容器状态 |
| 错误率过高 | `/metrics` 中 `errorRate > 0.05` | 检查最近错误日志 |
| 响应变慢 | 平均响应时间持续超过 `1000ms` | 检查数据库和服务器负载 |
