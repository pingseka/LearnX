# 前端说明

> 由施鹏负责编写

## 模块功能

前端为 LearnX（研途共享）考研资料付费共享平台提供用户交互界面，主要实现：
1. 响应式多终端页面适配（PC 端 + 移动端）；
2. 用户身份认证与管理（注册、登录、个人信息编辑）；
3. 考研资料分类浏览、搜索、预览与详情展示；
4. 资料上传与自主定价功能（支持 PDF/Word 格式）；
5. 订单创建、支付流程（微信/支付宝 H5 支付）与状态反馈；
6. 个人中心模块（我的资料、我的订单、收益管理、提现申请）；
7. 与后端 API 无缝对接，实现数据交互与状态同步。

## 技术选型

- 前端框架：Vue 3（Composition API）
- 构建工具：Vite
- UI 组件库：Element Plus
- HTTP 客户端：Axios
- 路由管理：Vue Router
- 状态管理：Pinia
- 支付集成：微信 H5 支付 SDK / 支付宝 H5 支付 SDK
- 响应式布局：Flexbox / Grid + 媒体查询

## 目录结构

frontend/
├── public/             # 静态资源目录
├── src/
│   ├── api/            # API 请求封装（用户、资料、订单等模块接口）
│   ├── assets/         # 图片、样式等静态资源
│   ├── components/     # 公共组件（导航栏、底部栏、资料卡片等）
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理（用户状态、购物车状态等）
│   ├── utils/          # 工具类（请求拦截、响应格式化、支付工具等）
│   ├── views/          # 页面组件
│   │   ├── Home/       # 首页
│   │   ├── Category/   # 分类页
│   │   ├── Upload/     # 上传页
│   │   ├── Detail/     # 资料详情页
│   │   ├── Payment/    # 支付页
│   │   └── User/       # 个人中心
│   ├── App.vue         # 根组件
│   └── main.js         # 项目入口
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── index.html          # HTML 模板
├── package.json        # 项目依赖配置
└── vite.config.js      # Vite 配置文件

## 运行方式

1. 搭建 Node.js 16+ 开发环境；
2. 进入 frontend 目录：`cd frontend`；
3. 安装依赖：`npm install`；
4. 配置环境变量（API 地址、支付配置等）；
5. 启动开发服务器：`npm run dev`；
6. 构建生产版本：`npm run build`；
7. 预览生产构建：`npm run preview`。
