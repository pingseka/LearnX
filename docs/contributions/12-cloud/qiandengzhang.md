# 云服务部署贡献说明

姓名：钱登涨<br>
学号：2207090524<br>
日期：2026-06-01

## 我完成的工作

### 1. 平台选择

- 使用平台：GitHub Actions + GHCR（GitHub Container Registry）+ Docker Compose

### 2. 部署配置

- [x] 编写前后端多阶段 Dockerfile（node:20-alpine 基础镜像）
- [x] 配置开发环境 compose.yaml（前端 + 后端 + 数据卷持久化）
- [x] 配置生产环境 compose.prod.yaml（资源限制 + Secrets 管理）
- [x] 编写 GitHub Actions CI/CD 工作流，push main 自动构建镜像
- [x] 集成 Trivy 镜像安全扫描（CRITICAL/HIGH 级别漏洞检测）
- [x] 配置 GHCR 容器镜像仓库，实现版本化管理
- [x] 创建前后端 .dockerignore，优化构建上下文大小
- [x] 配置容器健康检查，确保后端就绪后前端才启动

### 3. 问题解决

- 遇到的问题：Docker Hub 镜像拉取失败（网络问题）。
- 解决方案：配置国内 npm 镜像源（npmmirror.com），成功解决依赖安装问题。
- 遇到的问题：前端生产环境 API 地址写死为 localhost:3001。
- 解决方案：通过 Docker build-args 传入 `NEXT_PUBLIC_API_URL=/api`，由 Nginx 反向代理转发。
- 遇到的问题：容器启动时权限不足导致文件写入失败。
- 解决方案：Dockerfile 中创建非 root 用户 `appuser`，并正确设置 uploads 和 data 目录权限。


## 心得体会

容器化让开发与生产环境保持一致，避免了"我本地能跑"的问题。多阶段构建能显著减小镜像体积，GitHub Actions 的自动化流水线让每次推送都能快速构建并扫描安全漏洞。整个过程中最大的收获是理解了从代码到运行的完整链路。
