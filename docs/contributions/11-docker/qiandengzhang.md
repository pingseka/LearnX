# 本周 Docker 容器化贡献说明

姓名：钱登涨

学号：2207090524

日期：2026-05-19

## 本周背景

项目需要实现 Docker 容器化部署，确保开发与生产环境一致，并通过 GitHub Actions 自动化部署流程。之前项目缺少容器化配置，需要完成以下任务：编写前后端 Dockerfile、配置 Docker Compose 开发和生产环境、设置 CI/CD 工作流。

## 我完成的工作

### 1. 后端 Dockerfile（多阶段构建）

- 使用 `node:20-alpine` 作为基础镜像，减小镜像体积。
- Builder 阶段安装所有依赖并执行 `npm run build` 编译 TypeScript。
- Runner 阶段仅复制必要文件（node\_modules、dist、package.json）。
- 创建非 root 用户 `appuser` 运行应用，增强安全性。
- 配置健康检查端点 `/health`，支持容器健康检测。
- 暴露端口 3001，配置日志输出。

### 2. 前端 Dockerfile（多阶段构建）

- 使用 `node:20-alpine` 作为基础镜像。
- Builder 阶段安装依赖并执行 `npm run build` 构建 Next.js 应用。
- Runner 阶段复制构建产物（.next、public、node\_modules）。
- 创建非 root 用户运行，配置健康检查。
- 暴露端口 3000。

### 3. 开发环境配置（compose.yaml）

- 配置三个服务：frontend、backend、db（MySQL 8.0）。
- MySQL 端口映射为 3307（避免与本地 MySQL 冲突）。
- 配置数据库健康检查，确保服务启动顺序正确。
- 使用命名卷 `pgdata` 持久化数据库数据。
- 配置环境变量连接数据库。

### 4. 生产环境配置（compose.prod.yaml）

- 配置资源限制（前端/后端 512MB，数据库 1GB）。
- 使用 Docker Secrets 管理数据库密码和 JWT 密钥。
- 配置容器重启策略为 `unless-stopped`。
- 配置健康检查，支持容器自动恢复。
- 从 GHCR 拉取镜像，支持版本管理。

### 5. GitHub Actions CI/CD（.github/workflows/docker.yml）

- 配置 push 到 main 分支时自动触发。
- 登录 GitHub Container Registry。
- 构建并推送前后端镜像到 GHCR。
- 使用 GitHub Actions 缓存加速构建。
- 集成 Trivy 镜像安全扫描，检测 CRITICAL/HIGH 级漏洞。

### 6. 配置文件完善

- 创建 `backend/.dockerignore` 和 `frontend/.dockerignore`，排除 node\_modules、dist、.git 等文件。
- 确保 `.env.example` 包含必要的环境变量模板。
- 更新根目录 `.gitignore`，排除 secrets、uploads、环境变量文件。

## 主要修改文件

- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `compose.yaml`
- `compose.prod.yaml`
- `.github/workflows/docker.yml`
- `backend/.env.example`
- `.gitignore`

## 验证结果

| 验证项     | 结果 |
| ------- | -- |
| 后端容器启动  | 通过 |
| 前端容器启动  | 通过 |
| 数据库容器启动 | 通过 |
| 健康检查    | 通过 |
| 服务间通信   | 通过 |
| 数据持久化   | 通过 |

## 遇到的问题和解决

1. 问题：Docker Hub 镜像拉取失败（网络问题）。
   解决：配置国内 npm 镜像源（npmmirror.com），成功解决依赖安装问题。
2. 问题：端口冲突（本地 MySQL 占用 3306）。
   解决：将 Docker MySQL 端口映射改为 3307，内部仍使用 3306。
3. 问题：前端静态资源加载失败。
   解决：修复 Dockerfile 中 `.next` 目录复制路径错误。
4. 问题：容器启动时用户权限不足。
   解决：在 Dockerfile 中创建非 root 用户并设置正确权限。

## 心得体会

Docker 容器化是项目部署的重要环节，通过多阶段构建可以显著减小镜像体积，非 root 用户运行增强了安全性。Docker Compose 简化了多容器应用的管理，GitHub Actions 实现了自动化构建和安全扫描。虽然过程中遇到了网络和配置问题，但通过逐步排查都得到了解决，让我对容器化部署有了更深入的理解。
