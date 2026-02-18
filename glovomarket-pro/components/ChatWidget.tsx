import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Icons } from '../constants';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', sender: 'ai', text: 'Hi! I can help you find products. Ask me anything like "What is under $20?"', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const history = messages.map(m => `${m.sender}: ${m.text}`);
    const responseText = await geminiService.sendMessage(history, userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-96 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
          {/* Header */}
          <div className="bg-glovo-yellow p-4 flex justify-between items-center">
            <h3 className="font-bold text-glovo-dark flex items-center">
              <span className="mr-2"><Icons.MessageCircle /></span>
              Glovo Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-glovo-dark hover:bg-yellow-400 p-1 rounded-full transition">
              <Icons.X />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-glovo-green text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products..."
              className="flex-grow p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-glovo-yellow text-sm text-gray-900 placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="p-2 bg-glovo-green text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition"
            >
              <Icons.Send />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${
            isOpen ? 'bg-gray-200 text-gray-600' : 'bg-glovo-yellow text-glovo-dark'
        }`}
      >
        {isOpen ? <Icons.X /> : <Icons.MessageCircle />}
      </button>
    </div>
  );
};