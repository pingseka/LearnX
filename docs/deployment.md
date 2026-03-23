# 部署与基础设施说明

> 由许正扬负责编写

## 模块功能

本模块涵盖项目基础设施与部署相关职责，包括：

- **数据库设计**：设计 MySQL 表结构，保证订单、抽成、收益等业务数据的事务一致性
- **支付 / 文件存储服务集成**：集成微信 / 支付宝支付 SDK（沙箱环境）、阿里云 OSS / 腾讯云 COS 实现资料文件存储
- **项目部署与版本控制**：搭建部署环境，维护 Git 分支策略与版本发布流程
- **前后端联调兜底**：协调前后端接口对接，处理跨端联调问题

## 技术选型

| 类别       | 技术方案                    | 说明                                   |
| ---------- | --------------------------- | -------------------------------------- |
| 数据库     | MySQL 8.x                   | 支持事务，保证订单 / 抽成数据一致性     |
| 文件存储   | 阿里云 OSS / 腾讯云 COS     | 存储 PDF/Word 等考研资料文件            |
| 支付       | 微信支付 + 支付宝支付 SDK  | 沙箱环境测试，支持 H5 与服务端对接      |
| 版本控制   | Git + GitHub                | main / develop 分支策略，PR 合并流程    |
| 部署方式   | 云服务器 / Docker（规划中） | 待项目成型后确定具体部署方案            |

## 目录结构

```
yantushare/
├── README.md
├── .gitignore
├── docs/
│   ├── frontend.md      # 前端说明（施鹏）
│   ├── backend.md       # 后端说明（钱登涨）
│   ├── api.md           # API 设计（钱登涨）
│   └── deployment.md    # 部署与基础设施说明（本模块）
├── frontend/            # 前端代码（Vue 3 + Vite）
├── backend/             # 后端代码（FastAPI）
└── scripts/             # 部署脚本、数据库迁移脚本（规划中）
```

## 运行方式

### 环境准备

1. **MySQL**：安装 MySQL 8.x，创建数据库 `learnx`
2. **Python**：3.10+，用于运行 FastAPI 后端
3. **Node.js**：18+，用于运行 Vue 前端
4. **云服务**：配置 OSS/COS 存储桶、支付沙箱账号（开发阶段）

### 本地开发

```bash
# 后端
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

### 部署流程（规划）

1. 将代码推送到 `develop` 分支，通过 PR 合并到 `main`
2. 在服务器拉取 `main` 最新代码
3. 执行数据库迁移、安装依赖、构建前端静态资源
4. 使用 Nginx 反向代理 + uWSGI/Gunicorn 运行后端服务

> 具体部署步骤待前后端开发完成后补充。
