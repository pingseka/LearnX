# 后端开发贡献说明

姓名：许正扬
学号：2312190402
日期：2025-07-18

## 我完成的工作

### API 实现

- [x] 用户认证 API（注册 / 登录 / 获取个人资料）— JWT 认证
- [x] 业务资源 1 CRUD：资料管理（Materials） — 创建、列表查询、详情、更新、删除、获取我的资料
- [x] 业务资源 2 CRUD：订单管理（Orders） — 创建订单、列表查询、详情、状态更新
- [x] 收益统计 API（Earnings） — 统计数据、收益明细
- [x] 统一错误响应 — 所有接口返回 {code: 0, data: {}, msg: "success"} 格式

### 数据库

- [x] 数据模型定义（User、Material、Order、OrderItem、Earning）
- [x] ORM 配置（Sequelize + MySQL）
- [x] 数据库自动同步（sequelize.sync）

### 部署

- [x] Dockerfile 编写（Node.js 20-slim，TypeScript 编译，生产环境优化）
- [x] docker-compose.yml 配置（backend + MySQL 8.0，健康检查，数据持久化）
- [x] 本地联调验证

### 其他改进

- [x] 修复 earnings 创建时 orderId/userId 错误的 bug
- [x] 修复 uploads 目录不存在导致上传失败的 bug
- [x] 移除未使用的 mongoose 依赖
- [x] CORS 配置改为环境变量控制
- [x] 添加 morgan 请求日志中间件
- [x] 添加 express-rate-limit 接口限流（100 次/15 分钟）
- [x] 统一所有 Controller 响应格式（19 个接口响应）

## 遇到的问题和解决

1. 问题：创建订单时 earnings 记录的 userId 使用了买家 ID 而非作者 ID
   解决：修改 orders.service.ts，使用 material.authorId 作为收益归属用户，同时修正收益计算为售价的 90%

2. 问题：服务器启动时 uploads 目录不存在导致文件上传 500 错误
   解决：在 app.ts 启动时和 upload.ts 中添加自动创建 uploads 目录的逻辑

3. 问题：Docker 容器中后端连接 MySQL 失败
   解决：在 docker-compose.yml 中配置 depends_on + healthcheck，确保 MySQL 完全启动后再启动后端

## 心得体会

本次后端开发中，最大的收获是理解了统一响应格式对前后端协作的重要性。通过创建 response.ts 工具函数，将所有接口统一为 {code, data, msg} 格式，大大简化了前端的错误处理逻辑。同时学习了 Docker 容器化部署的流程，包括多服务编排、健康检查和数据持久化。
