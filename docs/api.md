# 研料库 API 使用说明文档

## 概述

本文档描述了研料库（考研资料分享平台）后端API的使用方法，包括认证、素材管理、订单处理和收益统计等功能。

**基础URL**: `http://localhost:3001/api`

**认证方式**: JWT Bearer Token

---

## 目录

1. [认证相关API](#认证相关api)
2. [素材相关API](#素材相关api)
3. [订单相关API](#订单相关api)
4. [收益相关API](#收益相关api)
5. [错误处理](#错误处理)
6. [前端调用示例](#前端调用示例)

---

## 认证相关API

### 1. 用户注册

**接口**: `POST /auth/register`

**描述**: 创建新用户账户

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 用户昵称 |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（至少6位） |
| role | string | 否 | 角色（user/admin，默认user） |

**请求示例**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123",
  "role": "user"
}
```

**响应示例** (201 Created):
```json
{
  "user": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应**:
- `400` - 请求参数错误（邮箱格式不正确、密码太短等）
- `409` - 邮箱已被注册

---

### 2. 用户登录

**接口**: `POST /auth/login`

**描述**: 使用邮箱和密码登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |

**请求示例**:
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**响应示例** (200 OK):
```json
{
  "user": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应**:
- `400` - 请求参数错误
- `401` - 邮箱或密码错误

---

### 3. 获取个人资料

**接口**: `GET /auth/profile`

**描述**: 获取当前登录用户的信息

**认证**: 需要Bearer Token

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例** (200 OK):
```json
{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**:
- `401` - 未授权，token无效或过期

---

## 素材相关API

### 1. 获取素材列表

**接口**: `GET /materials`

**描述**: 获取所有素材的列表，支持分页和筛选

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量 |
| category | string | 否 | - | 分类筛选 |
| tag | string | 否 | - | 标签筛选 |
| search | string | 否 | - | 搜索关键词 |

**响应示例** (200 OK):
```json
{
  "materials": [
    {
      "id": 1,
      "title": "考研数学复习资料",
      "description": "包含高等数学、线性代数、概率论等全套复习资料",
      "price": 29.99,
      "category": "数学",
      "fileUrl": "/uploads/materials/math_review.pdf",
      "thumbnailUrl": "/uploads/thumbnails/math_review.jpg",
      "authorId": 1,
      "author": {
        "id": 1,
        "name": "张三"
      },
      "tags": [
        { "id": 1, "name": "数学" },
        { "id": 2, "name": "考研" }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100
}
```

---

### 2. 创建素材

**接口**: `POST /materials`

**描述**: 上传新素材（需要登录）

**认证**: 需要Bearer Token

**请求头**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 素材标题 |
| description | string | 是 | 素材描述 |
| price | number | 是 | 价格 |
| category | string | 是 | 分类 |
| tags | string | 否 | 标签JSON数组 |
| file | file | 是 | 素材文件 |
| thumbnail | file | 是 | 缩略图 |

**响应示例** (201 Created):
```json
{
  "id": 1,
  "title": "考研数学复习资料",
  "description": "包含高等数学、线性代数、概率论等全套复习资料",
  "price": 29.99,
  "category": "数学",
  "fileUrl": "/uploads/materials/math_review.pdf",
  "thumbnailUrl": "/uploads/thumbnails/math_review.jpg",
  "authorId": 1,
  "author": {
    "id": 1,
    "name": "张三"
  },
  "tags": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**:
- `400` - 请求参数错误
- `401` - 未授权，需要登录

---

### 3. 获取素材详情

**接口**: `GET /materials/{id}`

**描述**: 根据ID获取单个素材的详细信息

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 素材ID |

**响应示例** (200 OK):
```json
{
  "id": 1,
  "title": "考研数学复习资料",
  "description": "包含高等数学、线性代数、概率论等全套复习资料",
  "price": 29.99,
  "category": "数学",
  "fileUrl": "/uploads/materials/math_review.pdf",
  "thumbnailUrl": "/uploads/thumbnails/math_review.jpg",
  "authorId": 1,
  "author": {
    "id": 1,
    "name": "张三"
  },
  "tags": [
    { "id": 1, "name": "数学" }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**:
- `404` - 素材不存在

---

### 4. 更新素材

**接口**: `PUT /materials/{id}`

**描述**: 更新素材信息（需要登录，仅限作者）

**认证**: 需要Bearer Token

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 素材ID |

**请求参数**: 同创建素材接口，所有字段可选

**响应示例** (200 OK): 同素材详情响应

**错误响应**:
- `401` - 未授权，需要登录
- `403` - 无权修改此素材
- `404` - 素材不存在

---

### 5. 删除素材

**接口**: `DELETE /materials/{id}`

**描述**: 删除素材（需要登录，仅限作者）

**认证**: 需要Bearer Token

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 素材ID |

**响应示例** (200 OK):
```json
{
  "message": "素材已删除"
}
```

**错误响应**:
- `401` - 未授权，需要登录
- `403` - 无权删除此素材
- `404` - 素材不存在

---

### 6. 获取我的素材

**接口**: `GET /materials/author/me`

**描述**: 获取当前登录用户上传的所有素材

**认证**: 需要Bearer Token

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量 |

**响应示例** (200 OK): 同获取素材列表响应

**错误响应**:
- `401` - 未授权，需要登录

---

## 订单相关API

### 1. 获取订单列表

**接口**: `GET /orders`

**描述**: 获取当前用户的所有订单

**认证**: 需要Bearer Token

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量 |
| status | string | 否 | - | 订单状态筛选（pending/completed/cancelled） |

**响应示例** (200 OK):
```json
{
  "orders": [
    {
      "id": 1,
      "buyerId": 2,
      "buyer": {
        "id": 2,
        "name": "李四"
      },
      "totalAmount": 59.98,
      "status": "completed",
      "items": [
        {
          "id": 1,
          "orderId": 1,
          "materialId": 1,
          "material": {
            "id": 1,
            "title": "考研数学复习资料",
            "price": 29.99,
            "fileUrl": "/uploads/materials/math_review.pdf"
          },
          "quantity": 1,
          "price": 29.99
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 10
}
```

**错误响应**:
- `401` - 未授权，需要登录

---

### 2. 创建订单

**接口**: `POST /orders`

**描述**: 创建新订单（需要登录）

**认证**: 需要Bearer Token

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| items | array | 是 | 订单项数组 |
| items[].materialId | integer | 是 | 素材ID |
| items[].quantity | integer | 是 | 数量 |

**请求示例**:
```json
{
  "items": [
    {
      "materialId": 1,
      "quantity": 1
    },
    {
      "materialId": 2,
      "quantity": 2
    }
  ]
}
```

**响应示例** (201 Created):
```json
{
  "id": 1,
  "buyerId": 2,
  "buyer": {
    "id": 2,
    "name": "李四"
  },
  "totalAmount": 59.98,
  "status": "pending",
  "items": [
    {
      "id": 1,
      "orderId": 1,
      "materialId": 1,
      "material": {
        "id": 1,
        "title": "考研数学复习资料",
        "price": 29.99,
        "fileUrl": "/uploads/materials/math_review.pdf"
      },
      "quantity": 1,
      "price": 29.99
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**:
- `400` - 请求参数错误
- `401` - 未授权，需要登录

---

### 3. 获取订单详情

**接口**: `GET /orders/{id}`

**描述**: 根据ID获取订单详细信息

**认证**: 需要Bearer Token

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 订单ID |

**响应示例** (200 OK): 同创建订单响应

**错误响应**:
- `401` - 未授权，需要登录
- `404` - 订单不存在

---

### 4. 更新订单状态

**接口**: `PUT /orders/{id}/status`

**描述**: 更新订单状态（需要登录）

**认证**: 需要Bearer Token

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 订单ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | 是 | 订单状态（pending/completed/cancelled） |

**请求示例**:
```json
{
  "status": "completed"
}
```

**响应示例** (200 OK): 同订单详情响应

**错误响应**:
- `400` - 请求参数错误
- `401` - 未授权，需要登录
- `404` - 订单不存在

---

## 收益相关API

### 1. 获取收益统计

**接口**: `GET /earnings/stats`

**描述**: 获取当前用户的收益统计数据（需要登录）

**认证**: 需要Bearer Token

**响应示例** (200 OK):
```json
{
  "totalEarnings": 1500.50,
  "monthlyEarnings": 300.00,
  "dailyEarnings": 50.00,
  "materialCount": 10,
  "saleCount": 50,
  "trends": [
    {
      "date": "2024-01-01",
      "amount": 100.00
    },
    {
      "date": "2024-01-02",
      "amount": 150.00
    }
  ]
}
```

**错误响应**:
- `401` - 未授权，需要登录

---

### 2. 获取收益详情

**接口**: `GET /earnings/details`

**描述**: 获取当前用户的收益明细列表（需要登录）

**认证**: 需要Bearer Token

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量 |
| startDate | string | 否 | - | 开始日期（YYYY-MM-DD） |
| endDate | string | 否 | - | 结束日期（YYYY-MM-DD） |

**响应示例** (200 OK):
```json
{
  "earnings": [
    {
      "id": 1,
      "materialId": 1,
      "material": {
        "id": 1,
        "title": "考研数学复习资料"
      },
      "orderId": 1,
      "buyerId": 2,
      "buyer": {
        "id": 2,
        "username": "李四"
      },
      "amount": 29.99,
      "quantity": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50
}
```

**错误响应**:
- `401` - 未授权，需要登录

---

## 错误处理

### 错误响应格式

所有错误响应都遵循以下格式：

```json
{
  "message": "错误信息描述",
  "stack": "错误堆栈（仅在开发环境显示）"
}
```

### HTTP状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录 |
| 403 | Forbidden | 无权访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如邮箱已被注册） |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 前端调用示例

### 使用Fetch API

```javascript
// 登录示例
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  // 保存token到本地存储
  localStorage.setItem('token', data.token);
  return data;
};

// 获取素材列表示例（需要认证）
const getMaterials = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3001/api/materials?page=1&limit=10', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
};

// 上传素材示例（需要认证）
const createMaterial = async (formData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3001/api/materials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // FormData对象
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
};
```

### 使用Axios

```javascript
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// 请求拦截器 - 添加token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 登录
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// 获取素材列表
const getMaterials = async (params = {}) => {
  const response = await api.get('/materials', { params });
  return response.data;
};

// 创建素材
const createMaterial = async (formData) => {
  const response = await api.post('/materials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
```

---

## 注意事项

1. **Token管理**: 登录成功后，请将token保存在本地存储（localStorage）中，并在后续请求的请求头中添加 `Authorization: Bearer <token>`

2. **文件上传**: 上传素材时，请使用 `multipart/form-data` 格式，文件字段名分别为 `file`（素材文件）和 `thumbnail`（缩略图）

3. **错误处理**: 所有API请求都应该处理可能的错误情况，包括网络错误、认证失败、参数错误等

4. **分页查询**: 列表接口都支持分页，建议合理设置 `page` 和 `limit` 参数，避免一次性返回过多数据

5. **日期格式**: 日期参数请使用 `YYYY-MM-DD` 格式

---

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 实现认证、素材、订单、收益四大模块API
- 支持JWT认证
- 支持文件上传

---

**文档维护者**: 研料库开发团队  
**最后更新时间**: 2024-01-01