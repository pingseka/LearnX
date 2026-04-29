import request from 'supertest';
import express from 'express';
import { aiController } from '../../src/controllers/ai.controller';
import { errorMiddleware } from '../../src/middleware/error.middleware';
import { aiService } from '../../src/services/ai.service';

jest.mock('../../src/services/ai.service', () => ({
  aiService: {
    chat: jest.fn(),
    generateDescription: jest.fn()
  }
}));

const app = express();
app.use(express.json());
app.post('/api/ai/chat', ...aiController.chat);
app.post('/api/ai/generate-description', ...aiController.generateDescription);
app.use(errorMiddleware);

describe('AI API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/chat', () => {
    it('should return chat reply successfully', async () => {
      (aiService.chat as jest.Mock).mockResolvedValue({ reply: '可以通过订单页面查看购买记录' });

      const response = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [{ role: 'user', content: '怎么查看订单？' }]
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(0);
      expect(response.body.data.reply).toBe('可以通过订单页面查看购买记录');
      expect(aiService.chat).toHaveBeenCalledWith({
        messages: [{ role: 'user', content: '怎么查看订单？' }]
      });
    });

    it('should return 400 when messages is missing', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(1);
      expect(aiService.chat).not.toHaveBeenCalled();
    });

    it('should return 400 when message role is invalid', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [{ role: 'teacher', content: '你好' }]
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain('消息角色必须是user、assistant或system');
    });

    it('should pass service errors to error middleware', async () => {
      (aiService.chat as jest.Mock).mockRejectedValue(new Error('AI service unavailable'));

      const response = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [{ role: 'user', content: '你好' }]
        });

      expect(response.status).toBe(500);
      expect(response.body.msg).toBe('AI service unavailable');
    });
  });

  describe('POST /api/ai/generate-description', () => {
    it('should generate material description successfully', async () => {
      (aiService.generateDescription as jest.Mock).mockResolvedValue({
        description: '覆盖核心知识点，适合冲刺复习。'
      });

      const response = await request(app)
        .post('/api/ai/generate-description')
        .send({
          title: '考研政治冲刺讲义',
          category: '政治'
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(0);
      expect(response.body.data.description).toBe('覆盖核心知识点，适合冲刺复习。');
      expect(aiService.generateDescription).toHaveBeenCalledWith({
        title: '考研政治冲刺讲义',
        category: '政治'
      });
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/ai/generate-description')
        .send({ category: '英语' });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain('资料标题不能为空');
      expect(aiService.generateDescription).not.toHaveBeenCalled();
    });

    it('should return 400 when category is missing', async () => {
      const response = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: '考研数学真题' });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain('资料分类不能为空');
      expect(aiService.generateDescription).not.toHaveBeenCalled();
    });
  });
});
