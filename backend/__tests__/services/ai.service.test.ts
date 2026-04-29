const mockCompletionsCreate = jest.fn();

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCompletionsCreate
      }
    }
  }))
}));

jest.mock('../../src/config/env', () => ({
  env: {
    AI_PROVIDER: 'deepseek',
    AI_API_KEY: 'test-api-key',
    AI_BASE_URL: 'https://api.deepseek.com/v1',
    AI_MODEL: 'deepseek-chat'
  }
}));

import { OpenAI } from 'openai';
import { env } from '../../src/config/env';
import { aiService } from '../../src/services/ai.service';

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    env.AI_PROVIDER = 'deepseek';
    env.AI_API_KEY = 'test-api-key';
    env.AI_BASE_URL = 'https://api.deepseek.com/v1';
    env.AI_MODEL = 'deepseek-chat';
    mockCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: 'AI reply' } }]
    });
  });

  describe('chat', () => {
    it('should call OpenAI-compatible chat API with system prompt and user messages', async () => {
      const result = await aiService.chat({
        messages: [{ role: 'user', content: '如何购买资料？' }]
      });

      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        baseURL: 'https://api.deepseek.com/v1'
      });
      expect(mockCompletionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'deepseek-chat',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            { role: 'user', content: '如何购买资料？' }
          ]),
          temperature: 0.7,
          max_tokens: 1000
        })
      );
      expect(result).toEqual({ reply: 'AI reply' });
    });

    it('should return fallback reply when AI response is empty', async () => {
      mockCompletionsCreate.mockResolvedValue({ choices: [] });

      const result = await aiService.chat({
        messages: [{ role: 'user', content: '你好' }]
      });

      expect(result.reply).toBe('抱歉，我无法回答这个问题。');
    });

    it('should throw a clear error when cloud API key is missing', async () => {
      env.AI_API_KEY = '';

      await expect(
        aiService.chat({ messages: [{ role: 'user', content: '你好' }] })
      ).rejects.toThrow('AI_API_KEY is not set');
      expect(mockCompletionsCreate).not.toHaveBeenCalled();
    });

    it('should create Ollama client when AI_PROVIDER is ollama', async () => {
      env.AI_PROVIDER = 'ollama';
      env.AI_API_KEY = '';
      env.AI_BASE_URL = 'http://localhost:11434/v1';
      env.AI_MODEL = 'llama3';

      await aiService.chat({
        messages: [{ role: 'user', content: '本地模型测试' }]
      });

      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: 'ollama',
        baseURL: 'http://localhost:11434/v1'
      });
      expect(mockCompletionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'llama3' })
      );
    });
  });

  describe('generateDescription', () => {
    it('should generate material description with title and category', async () => {
      mockCompletionsCreate.mockResolvedValue({
        choices: [{ message: { content: '适合考研英语复习的资料描述' } }]
      });

      const result = await aiService.generateDescription({
        title: '考研英语真题',
        category: '英语'
      });

      expect(mockCompletionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'deepseek-chat',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('标题：考研英语真题')
            })
          ]),
          max_tokens: 300
        })
      );
      expect(result).toEqual({ description: '适合考研英语复习的资料描述' });
    });

    it('should return fallback description when AI response is empty', async () => {
      mockCompletionsCreate.mockResolvedValue({
        choices: [{ message: { content: '' } }]
      });

      const result = await aiService.generateDescription({
        title: '数学讲义',
        category: '数学'
      });

      expect(result.description).toBe('抱歉，我无法生成描述。');
    });
  });
});
