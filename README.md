# LearnX（研途共享）

> 面向考研学子的考研资料专属付费共享平台

[![CI](https://github.com/pingseka/LearnX/actions/workflows/ci.yml/badge.svg)](https://github.com/pingseka/LearnX/actions)
[![Backend Coverage](https://codecov.io/gh/pingseka/LearnX/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/pingseka/LearnX)
[![Frontend Coverage](https://codecov.io/gh/pingseka/LearnX/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/pingseka/LearnX)


## 团队成员


| 姓名  | 学号         | 分工 |
| --- | ---------- | --- |
| 施鹏  | 2312190416 | 前端页面与交互开发：负责首页、资料市场、上传资料、资料详情、购买弹窗、个人中心等主要页面开发，完成响应式布局、页面交互、组件拆分、主题样式和前端展示效果 |
| 钱登涨 | 2207090524 | 后端 API 与基础服务开发：负责用户认证、资料管理、订单管理、收益统计等核心接口开发，完成数据库模型、业务分层、权限校验、安全加固和后端测试 |
| 许正扬 | 2312190402 | 全栈联调与核心业务闭环开发：负责真实数据接入、资料上传审核、资料预览与下载权限、演示支付流程、订单与作者收益结算、免费样例资料导入、腾讯云部署、Nginx HTTPS 网关和基础监控 |


## 项目简介

本项目是面向考研学子的考研资料专属付费共享响应式 Web 应用，核心解决考研优质资料获取难、资料创作者收益无保障的问题。用户可上传 PDF/Word 格式的考研资料并自主定价，其他用户可按资料分类（政治 / 英语 / 数学 / 专业课）浏览、预览并购买。支付模块采用课程项目演示支付模式，暂不接入真实微信 / 支付宝扣款，但完整保留订单创建、支付完成状态、资料下载权限、平台 10% 服务费和作者 90% 收益记录，适合课程项目演示完整交易闭环。平台同时支持资料审核、订单查询、收益查看、资料管理等功能，响应式设计适配电脑、手机等多终端。

## 在线演示

- 演示地址：[https://learnx.promptrule.com/](https://learnx.promptrule.com/)
<img width="2555" height="1480" alt="28a1a4649d1ea8cf01fb93cf6cbc2455" src="https://github.com/user-attachments/assets/0c365ef1-cf46-40ae-95f7-0f4fb7c90479" />



## 项目目录结构

```
LearnX/
├── CLAUDE.md                # AI 辅助开发规则
├── backend/                 # 后端项目目录
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── app.ts           # 应用入口
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # 前端项目目录
│   ├── app/                 # Next.js 页面
│   ├── components/          # 页面与通用组件
│   ├── hooks/               # 自定义 Hook
│   ├── lib/                 # 工具函数与模拟数据
│   ├── public/              # 静态资源
│   └── package.json
├── docs/                    # 文档目录
│   ├── architecture.md      # 架构设计文档
│   ├── database.md          # 数据库设计文档
│   ├── api.md               # API 文档
│   ├── backend.md           # 后端说明
│   ├── frontend.md          # 前端说明
│   ├── deployment.md        # 部署文档
│   └── contributions/
│       ├── 02-ui/           # UI 阶段贡献说明
│       └── 03-architecture/ # 架构设计阶段贡献说明
├── .gitignore
└── README.md
```

## 文档导航

- [设计说明](docs/design/design-spec.md) - 配色方案、字体、核心页面、交互说明
- [前端说明](docs/frontend.md) - 前端模块功能、技术选型、目录结构、运行方式
- [后端说明](docs/backend.md) - 后端模块功能、技术选型、目录结构、运行方式
- [API 文档](docs/api.md) - 接口说明
- [部署文档](docs/deployment.md) - 部署说明
- [监控文档](docs/monitoring.md) - JSON 日志、健康检查和基础指标
- [个人贡献说明](docs/contributions/) - 团队成员个人贡献

## 设计资源

- **设计工具**：v0.dev
- **设计链接**：[https://v0.app/chat/-my0oYyN2GRT?ref=BHS4JI](https://v0.app/chat/-my0oYyN2GRT?ref=BHS4JI)
- **设计说明**：详见 docs/design/design-spec.md

## 技术栈

- 前端：Next.js + React + TypeScript + Tailwind CSS
- 后端：Node.js + Express + TypeScript + Sequelize
- 数据库：SQLite + Docker volume 持久化
- 部署：腾讯云服务器 + Docker Compose + Nginx HTTPS

## 本地运行与验收数据

```bash
npm install --prefix backend
npm install --prefix frontend
npm run dev --prefix backend
npm run dev --prefix frontend
```

后端首次启动会同步 SQLite 表结构。需要给老师演示完整数据时，先保持后端至少启动过一次，再执行：

```bash
npm run seed:demo --prefix backend
```

该脚本会导入管理员、作者、买家、免费资料、付费资料、已完成演示订单和作者收益，可重复执行。上传文件本地保存在 `backend/uploads`；生产环境保存在 Docker 的 `uploads` volume，对应容器内 `/app/uploads`。

演示账号密码统一为 `123456`：

| 账号 | 用途 | 预置数据 |
| --- | --- | --- |
| `123@qq.com` | 管理员审核 | 4 份已审核免费资料 |
| `author@learnx.local` | 卖家/创作者 | 2 份付费资料，已有作者收益 |
| `buyer@learnx.local` | 买家 | 已购买 2 份资料，可看订单和下载 |
| `student@learnx.local` | 买家 | 已购买 1 份资料，用于验证多账号订单数据 |

## 测试命令

```bash
npm test --prefix backend
npm run build --prefix backend
npm run lint --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
```

## 分工说明


| 成员 | 职责模块 | 详细说明 |
| --- | --- | --- |
| 施鹏（前端页面与交互开发） | 前端页面、组件、交互与响应式适配 | 主要负责前端页面搭建和交互体验，包括首页、资料市场、资料详情、上传资料、购买弹窗、个人中心等页面；封装资料卡片、分类卡片、统计卡片、文件上传等组件；完成桌面端和移动端响应式布局；配合接口数据展示页面状态 |
| 钱登涨（后端 API 与基础服务开发） | 用户、资料、订单、收益、安全等后端基础能力 | 主要负责后端接口和基础服务，包括 Express + TypeScript 后端结构搭建；用户认证、资料管理、订单管理、收益统计等核心 API；User、Material、Order、OrderItem、Earning 等数据模型；权限校验、安全加固、错误处理和后端测试 |
| 许正扬（全栈联调与核心业务闭环开发） | 真实数据流、交易闭环、审核预览、部署上线与监控 | 主要负责前后端联调和核心业务闭环，包括将首页、资料市场、资料详情、个人中心、订单页、收益页等页面接入真实 API；完善上传审核、资料预览下载、演示购买、订单收益结算等关键流程；修正订单收益归属和付费资料权限问题；完成腾讯云 Docker Compose 部署、Nginx HTTPS 网关、自动部署和基础监控配置 |


## 项目功能规划

- 资料上传（PDF/Word）与自主定价
- 资料审核：用户上传后进入待审核，管理员审核通过后才进入资料市场
- 按分类（政治 / 英语 / 数学 / 专业课）浏览与预览
- 演示购买：课堂演示环境中暂不接入真实微信 / 支付宝扣款，但完整记录订单、支付完成状态和下载权限
- 平台自动抽取 10% 服务费，90% 计入上传者收益账户
- 作者收益查看、订单查询、资料管理
- 管理员审核后台，支持查看待审核资料并执行通过 / 拒绝
- 响应式设计，适配 PC 端与移动端

