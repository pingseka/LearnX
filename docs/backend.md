# 后端说明

## 模块功能
后端为 LearnX（研途共享）考研资料付费共享平台提供核心业务支撑，主要实现：
1.用户身份管理（注册、登录、权限校验）；
2.考研资料的上传、分类、查询及下载权限控制；
3.订单创建、支付状态同步、平台抽成计算；
4.创作者收益核算、提现申请处理；
5.对外提供标准化 API 接口，支撑前端多终端交互。
## 技术选型
开发语言：Python
后端框架：FastAPI
数据库：MySQL
接口交互：RESTful API
工具：JWT 鉴权、SQLAlchemy ORM
## 目录结构
backend/
├── main.py           # 项目入口（启动服务、注册路由）
├── api/              # 接口路由（用户、资料、订单等模块接口）
├── models/           # 数据库模型（用户、资料、订单等表结构）
├── service/          # 业务逻辑层（处理核心业务规则）
├── utils/            # 工具类（鉴权、响应格式化等）
└── config.py         # 配置文件（数据库、密钥等配置）
## 运行方式
1.搭建 Python 3.10 + 开发环境；
2.安装依赖：pip install fastapi uvicorn sqlalchemy python-jose；
3.配置config.py中的数据库连接信息；
4.启动服务：uvicorn main:app --reload；
5.访问接口文档：http://127.0.0.1:8000/docs（用于接口调试）。