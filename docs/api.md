# API 设计

## 接口说明

# 通用规则
1.接口前缀：/api/v1；
2.鉴权方式：除注册 / 登录外，其余接口需在请求头携带 JWT Token；
3.返回格式：统一 JSON 结构，包含code（状态码）、msg（提示信息）、data（业务数据）。
# 核心接口清单
模块	        核心接口	            功能说明
用户模块	/api/v1/user/register	    用户注册
	       /api/v1/user/login	       用户登录（返回 Token）
资料模块	/api/v1/material/upload	    资料上传
	       /api/v1/material/list	   资料列表查询
订单模块	/api/v1/order/create	    创建订单
	       /api/v1/order/pay	       发起支付
收益模块	/api/v1/profit/balance	    查询收益余额
	       /api/v1/profit/withdraw	   提交提现申请
# 总结
后端核心围绕用户、资料、订单、收益四大模块展开，技术选型以轻量、易上手的 Python+FastAPI 为主；
目录结构按 “入口 - 接口 - 逻辑 - 数据 - 工具” 分层，符合新手开发习惯；
API 设计遵循统一前缀、统一返回格式，核心接口覆盖平台核心业务，无冗余内容。