# 云服务部署贡献说明

姓名：许正扬<br>
学号：2312190402<br>
日期：2026-06-01

## 我完成的工作

### 1. 平台选择

- 使用平台：腾讯云服务器 + Docker Compose + Nginx HTTPS

### 2. 部署配置

- [x] 编写生产 Docker Compose 配置
- [x] 配置 SQLite 和上传文件持久化 volume
- [x] 编写 Nginx HTTPS 反向代理配置
- [x] 整理环境变量和 Docker secret 配置
- [x] 配置 GitHub 推送 `main` 后自动构建和部署

### 3. 问题解决

- 遇到的问题：旧配置启动 MySQL，但后端真实代码使用 SQLite。
- 解决方案：删除无效 MySQL 容器，使用 `DB_STORAGE` 和 Docker volume
  持久化 SQLite 文件。
- 遇到的问题：前端生产环境访问 `localhost:3001`。
- 解决方案：改成同域名 `/api`，由 Nginx 转发到后端容器。
- 遇到的问题：服务器已有 Nginx 和其他站点，生产 Compose 直接绑定
  `80/443` 会端口冲突。
- 解决方案：新增宿主机 Nginx 覆盖配置，仅将 LearnX 容器发布到
  `127.0.0.1:3100/3101`，再按域名转发。

## PR 链接

- PR #11: https://github.com/pingseka/LearnX/pull/11

## 在线地址

- https://learnx.promptrule.com

## 心得体会

部署不只是把项目启动起来。数据库文件、上传资料、密钥、HTTPS 和自动
更新都要分别处理，容器重建后仍能保留数据才算可用。
