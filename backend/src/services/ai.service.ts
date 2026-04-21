import { OpenAI } from 'openai';
import { env } from '../config/env';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

interface GenerateDescriptionRequest {
  title: string;
  category: string;
}

/** Returns an OpenAI-compatible client configured from environment variables.
 *  Supports DeepSeek (cloud) and Ollama (local) providers.
 */
function createAiClient(): OpenAI {
  if (env.AI_PROVIDER === 'ollama') {
    return new OpenAI({
      apiKey: 'ollama',
      baseURL: env.AI_BASE_URL || 'http://localhost:11434/v1'
    });
  }

  // Default: DeepSeek (or any OpenAI-compatible cloud provider)
  if (!env.AI_API_KEY) {
    throw new Error(
      'AI_API_KEY is not set. ' +
      'Please add it to your .env file (e.g. AI_API_KEY=sk-...).'
    );
  }

  return new OpenAI({
    apiKey: env.AI_API_KEY,
    baseURL: env.AI_BASE_URL
  });
}

export const aiService = {
  chat: async (data: ChatRequest) => {
    const client = createAiClient();

    const response = await client.chat.completions.create({
      model: env.AI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是一个考研资料平台的智能客服，负责回答用户关于考研资料的问题，' +
            '包括课程内容、价格、购买流程等。请保持专业、友好的语气。'
        },
        ...data.messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      reply:
        response.choices[0]?.message?.content || '抱歉，我无法回答这个问题。'
    };
  },

  generateDescription: async (data: GenerateDescriptionRequest) => {
    const client = createAiClient();

    const response = await client.chat.completions.create({
      model: env.AI_MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一个考研资料平台的内容助手，负责为用户生成简洁明了的资料描述。根据资料标题和分类，生成一段简洁的资料描述，包括核心内容、主要特点、适用人群和学习价值。描述应该直接、清晰，避免使用Markdown格式符号，让用户能快速看懂资料的主要内容。'
        },
        {
          role: 'user',
          content: `请为以下考研资料生成简洁的资料描述：\n标题：${data.title}\n分类：${data.category}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return {
      description: response.choices[0]?.message?.content || '抱歉，我无法生成描述。'
    };
  }
};
