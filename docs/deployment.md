# 腾讯云 Docker Compose 部署说明

> 负责人：许正扬<br>
> 学号：2312190402

## 1. 部署方案

LearnX 使用腾讯云服务器、Docker Compose、Nginx 和 Let's Encrypt
证书部署。Nginx 是唯一公网入口，负责 HTTPS 和反向代理。

```text
浏览器
  -> HTTPS 443
  -> Nginx gateway
     -> /              Next.js frontend:3000
     -> /api           Express backend:3001
     -> /uploads       Express backend:3001
     -> /health        后端健康检查
     -> /metrics       后端指标查询
```

后端真实使用 SQLite。数据库文件和用户上传资料分别保存在 Docker
volume 中，更新容器不会丢失数据。

## 2. 部署文件

| 文件 | 用途 |
| --- | --- |
| `compose.prod.yaml` | 生产容器编排 |
| `deploy/nginx/templates/default.conf.template` | Nginx HTTPS 网关 |
| `deploy/.env.production.example` | 生产环境变量模板 |
| `deploy/update.sh` | 服务器拉取镜像并更新容器 |
| `deploy/renew-cert.sh` | 续期 HTTPS 证书并重启网关 |
| `.github/workflows/docker.yml` | 推送 `main` 后构建镜像 |
| `.github/workflows/deploy.yml` | 镜像构建成功后 SSH 自动部署 |

## 3. 首次部署

以下命令在腾讯云服务器执行。执行前需要确认域名已经解析到服务器公网
IP，安全组已经放行 `22`、`80` 和 `443` 端口。

### 3.1 准备目录

```bash
git clone https://github.com/pingseka/LearnX.git
cd LearnX
cp deploy/.env.production.example .env
mkdir -p secrets
```

编辑 `.env`，把 `DOMAIN` 改成真实域名。`GITHUB_REPOSITORY` 必须使用
小写：

```dotenv
DOMAIN=你的域名
GITHUB_REPOSITORY=pingseka/learnx
VERSION=latest
```

生成敏感配置文件：

```bash
openssl rand -hex 32 > secrets/jwt_secret.txt
openssl rand -hex 32 > secrets/monitoring_token.txt
chmod 600 secrets/*.txt
```

敏感文件已被 `.gitignore` 排除，不能提交到 GitHub。

### 3.2 获取 HTTPS 证书

先安装 Certbot，再申请证书。首次申请时 `80` 端口不能被其他服务占用。

```bash
sudo apt update
sudo apt install -y certbot
sudo certbot certonly --standalone -d 你的域名
```

证书会保存在 `/etc/letsencrypt/live/你的域名/`。生产 Compose 会以只读
方式挂载证书目录。

### 3.3 启动服务

如果 GHCR 镜像不是公开镜像，先登录：

```bash
echo "你的 GitHub PAT" | docker login ghcr.io -u 你的GitHub用户名 --password-stdin
```

启动：

```bash
sh deploy/update.sh
```

## 4. 环境变量

| 配置 | 位置 | 说明 |
| --- | --- | --- |
| `DOMAIN` | `.env` | 已解析到服务器的域名 |
| `NODE_ENV=production` | `compose.prod.yaml` | 生产运行模式 |
| `DB_STORAGE` | `compose.prod.yaml` | SQLite 持久化路径 |
| `JWT_SECRET_FILE` | Docker secret | JWT 签名密钥文件 |
| `MONITORING_TOKEN_FILE` | Docker secret | 指标接口访问令牌文件 |
| `AI_API_KEY` | `.env` | 可选，第三方 AI 服务密钥 |

例如用户访问 `https://你的域名/api/materials` 时，请求会先到 Nginx，
再转发到后端容器。浏览器不会访问用户自己电脑上的 `localhost`。

## 5. 自动部署

推送到 `main` 后：

1. `docker.yml` 构建前端和后端镜像并推送到 GHCR。
2. 镜像安全扫描通过后，`deploy.yml` 通过 SSH 登录腾讯云服务器。
3. 服务器执行 `git pull --ff-only origin main` 和 `sh deploy/update.sh`。

需要在 GitHub 仓库的 Actions secrets 配置：

| Secret | 示例说明 |
| --- | --- |
| `DEPLOY_HOST` | 腾讯云服务器公网 IP |
| `DEPLOY_PORT` | SSH 端口，通常为 `22` |
| `DEPLOY_USER` | SSH 用户，例如 `ubuntu` |
| `DEPLOY_SSH_KEY` | SSH 私钥完整内容 |
| `DEPLOY_KNOWN_HOSTS` | 服务器 SSH 主机指纹 |
| `DEPLOY_PATH` | 服务器项目绝对路径 |

## 6. 验证

```bash
docker compose --env-file .env -f compose.prod.yaml ps
curl https://你的域名/health
curl -H "Authorization: Bearer 你的监控令牌" https://你的域名/metrics
```

`/health` 正常时会返回：

```json
{
  "status": "healthy",
  "version": "latest",
  "database": "healthy"
}
```

## 7. HTTPS 续期

测试续期：

```bash
sudo certbot renew --dry-run
```

正式续期使用脚本。脚本会短暂停止网关，避免 Certbot 和 Nginx 同时占用
`80` 端口：

```bash
sudo sh deploy/renew-cert.sh
```
