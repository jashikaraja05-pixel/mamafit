import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ShieldAlert, Heart, RefreshCw } from 'lucide-react';
import { useMamaStore } from '../store/useMamaStore';
import { ChatMessage } from '../types';

export const CoachPage: React.FC = () => {
  const { profile } = useMamaStore();
  const week = profile.pregnancyWeek || 24;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello beautiful mama ${profile.name || ''} 🌸! I am MamaFit AI, your warm pregnancy wellness companion.\n\nYou are in Week ${week} of your journey! How are you and baby feeling today? Whether you have questions about morning sickness, prenatal iron-rich meals, safe stretches, or feeling tired, I'm right here beside you 💛`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'I feel nauseous, what helps?',
    'Best foods for iron?',
    'Safe exercises this week?',
    'Why am I so tired?',
    'Baby kick count guidelines?',
    'What should I pack for hospital?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          profile,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        "I'm right here with you sweet mama 💛 Remember to take a gentle breath, stay hydrated, and check with your healthcare provider for any urgent concerns.";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          "Oh mama 💛 I'm receiving so much love right now. Please take a gentle sip of water and try asking again in just a moment. Remember your body is doing miraculous work!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Refreshed and ready for you, mama 🌸 How can I support your pregnancy wellness today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100dvh-185px)] sm:h-[calc(100vh-150px)] min-h-[460px] flex-col rounded-3xl border border-[#f0dfea] bg-white shadow-soft overflow-hidden">
      {/* 1. Coach Header */}
      <div className="flex items-center justify-between border-b border-[#f0dfea] bg-[#fff8fb] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f075aa] to-[#c1a9ee] text-white shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-[#231426]">
                MamaFit AI Coach
              </h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Active 🌸
              </span>
            </div>
            <p className="text-[11px] text-[#745f78]">
              Personalized for Week {week} · Loving Pregnancy Guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Reset conversation"
          className="rounded-full p-2 text-[#745f78] hover:bg-white hover:text-[#231426] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Medical Banner */}
      <div className="flex items-center gap-2 border-b border-rose-100 bg-rose-50/70 px-4 py-2 text-[11px] text-rose-900">
        <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
        <span>
          💛 Educational wellness companion. Always consult your OB-GYN or midwife for medical diagnoses.
        </span>
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? 'bg-[#231426] text-white'
                    : 'bg-[#fff0f6] text-[#f075aa] border border-[#f075aa]/20'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${
                  isUser
                    ? 'bg-[#f075aa] text-white shadow-soft rounded-tr-xs'
                    : 'bg-[#fff8fb] border border-[#f0dfea] text-[#231426] rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {msg.content}
                <div
                  className={`mt-1.5 text-[10px] ${
                    isUser ? 'text-white/80 text-right' : 'text-[#745f78]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#745f78]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa] border border-[#f075aa]/20">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2.5 shadow-xs">
              <span className="inline-block animate-pulse">MamaFit AI is typing gently... 🌸</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Prompts Chips */}
      <div className="border-t border-[#f0dfea] bg-[#fffdfa] px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#745f78] mr-1">
            Ideas:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="rounded-full border border-[#f0dfea] bg-white px-2.5 py-1 text-[11px] font-medium text-[#745f78] hover:border-[#f075aa] hover:text-[#f075aa] transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 border-t border-[#f0dfea] bg-white p-3 sm:p-4"
      >
        <input
          type="text"
          placeholder={`Ask MamaFit AI about Week ${week}, nutrition, or wellness...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2.5 text-xs text-[#231426] placeholder-[#745f78] focus:border-[#f075aa] focus:bg-white focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f075aa] text-white shadow-soft transition-all hover:bg-[#e05892] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
