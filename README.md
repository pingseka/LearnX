# LearnX（研途共享）

> 面向考研学子的考研资料专属付费共享平台

[![CI](https://github.com/pingseka/LearnX/actions/workflows/ci.yml/badge.svg)](https://github.com/pingseka/LearnX/actions)
[![Backend Coverage](https://codecov.io/gh/pingseka/LearnX/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/pingseka/LearnX)
[![Frontend Coverage](https://codecov.io/gh/pingseka/LearnX/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/pingseka/LearnX)


## 团队成员


| 姓名  | 学号         | 分工                                                                  |
| --- | ---------- | ------------------------------------------------------------------- |
| 施鹏  | 2312190416 | 前端开发：负责全平台响应式页面开发、交互逻辑实现、前端接口对接、支付页面调起与状态反馈                         |
| 钱登涨 | 2207090524 | 后端开发：负责核心业务 API 接口开发、订单 / 抽成 / 收益结算逻辑、用户权限管理、资料下载权限控制               |
| 许正扬 | 2312190402 | 项目负责人（兼核心模块开发）：统筹项目进度 + 数据库设计 + 支付 / 文件存储服务集成 + 项目部署与版本控制 + 前后端联调兜底 |


## 项目简介

本项目是面向考研学子的考研资料专属付费共享响应式 Web 应用，核心解决考研优质资料获取难、资料创作者收益无保障的问题。用户可上传 PDF/Word 格式的考研资料并自主定价，其他用户可按资料分类（政治 / 英语 / 数学 / 专业课）浏览、预览并付费购买，支付完成后平台自动抽取 10% 服务费，剩余 90% 直接计入资料上传者收益账户，支持收益提现、订单查询、资料管理等功能。响应式设计适配电脑、手机等多终端，为考研群体打造专属的资料交易平台。

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
- [个人贡献说明](docs/contributions/) - 团队成员个人贡献

## 设计资源

- **设计工具**：v0.dev
- **设计链接**：[https://v0.app/chat/-my0oYyN2GRT?ref=BHS4JI](https://v0.app/chat/-my0oYyN2GRT?ref=BHS4JI)
- **设计说明**：详见 docs/design/design-spec.md

## 技术栈（初步规划）

- 前端：Next.js + React + TypeScript + Tailwind CSS
- 后端：Node.js + Express + TypeScript + Sequelize
- 数据库：MySQL（支持事务，保证订单 / 抽成数据一致性）

## 分工说明


| 成员              | 职责模块                      | 说明                                 |
| --------------- | ------------------------- | ---------------------------------- |
| 施鹏（前端）          | 首页、分类页、上传页、购买页、个人中心等全前端模块 | ✅ 已完成：前端项目初始化、核心页面开发、响应式布局、主题切换、文件上传、资料购买、个人中心等功能实现 |
| 钱登涨（后端）         | 用户、资料、订单、抽成、收益五大核心模块 API  | ✅ 已完成：后端项目初始化、核心模块分层、基础接口与模型搭建 |
| 许正扬（负责人 + 核心开发） | 数据库设计、系统交互流程、部署、联调兜底   | ✅ 已完成：数据库设计文档、ER 图、系统交互流程、架构文档补充 |


## 项目功能规划

- 资料上传（PDF/Word）与自主定价
- 按分类（政治 / 英语 / 数学 / 专业课）浏览与预览
- 在线付费购买，支持微信 / 支付宝
- 平台自动抽取 10% 服务费，90% 计入上传者收益账户
- 收益提现、订单查询、资料管理
- 响应式设计，适配 PC 端与移动端

