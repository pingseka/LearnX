# 软件测试贡献说明

**姓名：钱登涨**  **学号：2207090524 角色：后端**  **日期：2026-04-28**

***

## 完成的测试工作

### 测试文件

所有测试文件位于 `backend/__tests__/` 目录下：

| 测试文件                                        | 测试内容      | 测试数量 |
| ------------------------------------------- | --------- | ---- |
| `utils/password.test.ts`                    | 密码哈希与验证   | 5    |
| `utils/jwt.test.ts`                         | JWT 生成与验证 | 3    |
| `utils/response.test.ts`                    | 响应工具函数    | 5    |
| `services/auth.service.test.ts`             | 用户认证服务    | 7    |
| `services/orders.service.test.ts`           | 订单服务      | 7    |
| `services/materials.service.test.ts`        | 素材服务（增删改） | 9    |
| `services/materials.service.getall.test.ts` | 素材服务（查询）  | 4    |
| `services/earnings.service.test.ts`         | 收益服务      | 3    |
| `api/auth.api.test.ts`                      | 认证接口      | 7    |
| `middleware/auth.middleware.test.ts`        | 认证中间件     | 4    |

### 测试清单

- [x] **正常情况测试（38 个）** - 用户注册/登录、订单创建、素材管理等核心流程
- [x] **边界/异常情况测试（19 个）** - 参数校验失败、资源不存在、权限不足等
- [x] **Mock 使用** - 所有数据库模型（User、Order、Material、Earnings、Tag）和外部依赖（JWT、密码工具）均使用 Jest Mock 隔离

### 覆盖率

- **核心模块覆盖率：86.01%**（远超 60% 要求）
- **服务层整体：86.01%**
- **auth.service.ts：100%**
- **orders.service.ts：100%**
- **earnings.service.ts：100%**
- **materials.service.ts：88%**

### AI 辅助

- **使用工具：GitHub Copilot**
- **Prompt 示例：**
  - "帮我为 auth.service.ts 编写单元测试，包括注册、登录和获取用户，使用 Jest Mock 隔离数据库"
  - "生成 API 测试用例，覆盖正常响应、参数校验失败、异常处理场景"
- **AI 生成 + 人工修改的测试数量：约 40 个**

***

## 遇到的问题和解决

1. **问题：** Sequelize 模型关联导致测试失败
   **解决：** 使用 `jest.mock()` 模拟整个模型模块，避免真实的数据库关联初始化
2. **问题：** Express 验证链（express-validator）在测试中无法正确解析
   **解决：** 使用扩展运算符 `...controller.method` 展开验证中间件数组
3. **问题：** 覆盖率未达标（初始约 45%）
   **解决：** 增加中间件测试和工具函数测试，重点覆盖核心服务层

***

## 心得体会

通过本次测试工作，我深刻体会到：

1. **Mock 的重要性**：合理使用 Mock 可以有效隔离外部依赖，使测试更加稳定和快速
2. **测试覆盖率的意义**：覆盖率指标帮助识别未测试的代码路径，指导测试用例的补充
3. **测试分层策略**：单元测试（服务层）+ 集成测试（API层）的组合能有效保障代码质量
4. **AI 辅助效率**：AI 工具能快速生成测试模板，节省重复劳动，但需要人工审查和调整以确保测试的完整性和准确性

测试不仅是发现 Bug 的手段，更是一种设计思维，促使我从使用者角度审视代码的健壮性和可维护性。
