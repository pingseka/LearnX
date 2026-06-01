'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import ReactMarkdown from 'react-markdown';
import { getApiUrl } from '@/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是研途共享的智能客服，有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl('/ai/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: input }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.data.reply,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我暂时无法回答你的问题，请稍后再试。',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </a>
            </Button>
          </div>

          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center">
            <MessageCircle className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-lg font-semibold">智能客服</h2>
              <p className="text-xs text-white/80">在线，随时为你解答问题</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-background border border-gray-200 rounded-b-lg p-4 h-[60vh] overflow-y-auto">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center">
                  <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                  <span className="text-sm text-gray-500 ml-2">正在思考...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-6 bg-muted p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">常见问题</h3>
            <div className="flex flex-wrap gap-2">
              {[
                '如何上传资料？',
                '如何购买资料？',
                '资料退款政策',
                '如何提现收益？'
              ].map((tip, index) => (
                <button
                  key={index}
                  onClick={() => setInput(tip)}
                  className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100"
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
