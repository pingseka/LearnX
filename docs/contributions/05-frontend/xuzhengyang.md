# 前端开发贡献说明

姓名：许正扬
学号：2312190402
技术栈：React (Next.js 16 + TypeScript + Tailwind CSS 4)
日期：2025-07-18

## 我完成的工作

### 页面开发

- [x] 登录/注册页面
- [x] 首页/列表页面
- [x] 详情页面
- [x] 个人中心（Dashboard 概览、资料管理、订单、收益、设置）
- [x] 上传页面（4步向导）

### 组件/模块封装

- 组件 1：MaterialCard — 资料卡片组件，展示资料封面、标题、价格、作者等信息，支持 hover scale 动效
- 组件 2：CategoryCard — 分类卡片组件，纯色块背景搭配图标和箭头指示，支持分类浏览导航
- 组件 3：StatsCard — 数据统计卡片组件，支持自定义颜色、趋势指示（涨/跌）、图标展示
- 组件 4：FileUpload — 文件上传组件，支持拖拽上传和点击选择，带文件类型和大小验证
- 组件 5：PurchaseDialog — 购买确认对话框组件，展示资料信息和价格，处理购买流程

### API 对接

- [x] 封装网络请求层（fetchApi + uploadFile，统一解析 {code, data, msg} 响应格式）
- [x] 对接后端接口（auth/register, auth/login, auth/profile, materials CRUD, orders CRUD, earnings stats/details）
- [x] 处理加载状态和错误（请求超时 15s/60s、AbortController、SSR 安全的 token 读取、错误 toast 提示）

### 设计系统

- [x] 实现 Flat Design 设计系统（零阴影、纯色块、几何装饰）
- [x] 引入 Outfit 几何无衬线字体
- [x] 配色方案：Primary Blue (#3B82F6)、Emerald (#10B981)、Amber (#F59E0B)
- [x] 响应式布局适配桌面和移动端

## 遇到的问题和解决

1. 问题：Tailwind CSS v4 使用了全新的配置语法（@theme inline 替代 tailwind.config.js）
   解决：学习 v4 的 @theme 语法，在 globals.css 中使用 oklch 色彩空间定义设计令牌

2. 问题：多个页面同时重写时需要保持设计一致性
   解决：先定义统一的设计系统（色板、间距、圆角、动效规则），再按页面逐一实现

3. 问题：Next.js 16 SSR 环境下 localStorage 不可用导致报错
   解决：在 fetchApi 中添加 typeof window !== 'undefined' 检查，确保 SSR 安全

## 心得体会

本次前端开发最大的收获是理解了 Flat Design 设计系统的实现方法。通过移除所有阴影和渐变，完全依靠颜色对比、字体层级和几何形状来建立视觉层次，这让我对 UI 设计有了更深的理解。同时也学习了 Tailwind CSS v4 的新特性和 Next.js 16 的最新用法。
