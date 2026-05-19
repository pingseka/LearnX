# 本周产品优化贡献说明

姓名：许正扬

学号：2312190402

日期：2026-05-12

账号：xzy111222333

## 本周背景

同学更新代码后，项目虽然有了资料上传、审核、CI、安全扫描等基础内容，但页面里还残留大量假数据。

例如：新注册用户进入个人中心后仍显示 `张同学`、`2580.50` 余额、假订单和假收益。这会让项目看起来像静态演示页面，不像真实可用系统。

## 我完成的工作

### 1. 清理假用户、假订单、假收益

- 将个人中心概览从假数据改为真实接口数据。
- 将左侧用户信息从 `张同学 / zhangsan@example.com` 改为当前登录用户。
- 将订单页从假订单列表改为读取 `/api/orders`。
- 将收益页从假收益列表改为读取 `/api/earnings/stats` 和 `/api/earnings/details`。
- 新用户没有数据时显示真实空状态，例如 `0 元`、`暂无订单`、`暂无收益记录`。

### 2. 打通沙盒购买流程

- 修正前端下单字段和后端接口字段不一致的问题。
- 购买弹窗不再用 `setTimeout` 假装支付成功。
- 点击沙盒购买后，会真实调用后端创建订单。
- 后端订单创建后直接标记为 `completed`，用于课堂沙盒演示。
- 每笔付费订单会给资料作者生成 90% 的沙盒收益记录。

### 3. 区分免费资料和付费资料

- 免费资料直接允许预览和下载，不创建 0 元订单。
- 付费资料未购买前不直接展示原文件，避免用户绕过购买流程。
- 购买成功后才开放付费资料的下载入口。

### 4. 首页和资料卡片去虚假宣传

- 首页资料推荐改为读取真实上架资料。
- 移除 `9000+ 资料`、`50000+ 用户`、`98% 好评率` 这类没有真实来源的数字。
- 资料卡片不再默认显示 `5.0` 评分和假购买人数。
- 没有评分、销量时就不展示，避免误导。

### 5. 保留必要静态配置

- 新增 `frontend/lib/catalog.ts`，只保存分类、价格格式化、日期格式化等真实可复用工具。
- `frontend/lib/mock-data.ts` 改成兼容导出，不再保存假用户、假订单和假收益。

## 主要修改文件

- `frontend/app/dashboard/page.tsx`
- `frontend/app/dashboard/orders/page.tsx`
- `frontend/app/dashboard/earnings/page.tsx`
- `frontend/app/dashboard/settings/page.tsx`
- `frontend/components/layout/dashboard-sidebar.tsx`
- `frontend/components/purchase-dialog.tsx`
- `frontend/components/material-card.tsx`
- `frontend/app/materials/[id]/page.tsx`
- `frontend/app/page.tsx`
- `frontend/lib/catalog.ts`
- `backend/src/services/orders.service.ts`
- `backend/src/services/earnings.service.ts`
- `backend/__tests__/services/orders.service.test.ts`
- `backend/__tests__/services/materials.service.getall.test.ts`

## 验证结果

| 验证项 | 结果 |
|---|---|
| 前端 Lint | 通过 |
| 后端 Lint | 通过 |
| 前端 Build | 通过 |
| 后端 Build | 通过 |
| 前端测试 | 26 个通过，0 个失败 |
| 后端测试 | 70 个通过，0 个失败 |

## 遇到的问题和解决

1. 问题：页面看起来数据很多，但都是前端假数组。
   解决：逐页排查 `mock-data` 引用，把生产页面改为读取真实 API。

2. 问题：购买按钮只是前端假成功，没有真实订单。
   解决：购买弹窗调用真实下单接口，后端创建完成订单并生成作者收益。

3. 问题：免费资料和付费资料混在一起，逻辑不清楚。
   解决：免费资料直接下载，付费资料购买后下载。

## 心得体会

这次优化让我意识到，一个项目不能只看页面是否“像样”。例如页面显示 `¥2580.50`，如果这个数字不是数据库算出来的，那它就是假的。真正可用的系统应该让页面、接口、数据库形成闭环：用户上传资料，管理员审核，买家购买，作者产生收益，每一步都有真实记录。
