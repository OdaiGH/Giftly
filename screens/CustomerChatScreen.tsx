
import React, { useState, useRef } from 'react';
import { Send, ChevronLeft, MoreVertical, Phone, Image as ImageIcon, Paperclip } from 'lucide-react';
import { Message } from '../types';

interface Props {
  onBack: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'أهلاً بك في دعم هديتي! كيف يمكننا مساعدتك اليوم؟', sender: 'other', time: '10:00 ص' },
  { id: '2', text: 'أهلاً، أريد الاستفسار عن حالة طلبي رقم #8742', sender: 'user', time: '10:01 ص' },
  { id: '3', text: 'أبشر، جاري فحص الحالة مع المندوب الآن. انتظرني لحظة فضلاً.', sender: 'other', time: '10:02 ص' },
];

export const CustomerChatScreen: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      time: 'الآن',
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleAttachImage = () => {
    // محاكاة إرسال صورة
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "تم إرفاق صورة 📸",
      sender: 'user',
      time: 'الآن',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFC] dark:bg-[#121212] overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -mr-2 text-gray-400">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img src="https://picsum.photos/seed/agent/100/100" className="w-10 h-10 rounded-2xl object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">دعم العملاء</h3>
            <p className="text-green-500 text-[10px] font-bold">متصل الآن</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-gray-400"><Phone size={20} /></button>
          <button className="p-2 text-gray-400"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'mr-auto items-end' : 'ml-auto items-start'}`}
          >
            <div
              className={`px-4 py-3 rounded-[20px] shadow-sm text-sm font-medium leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#E0AAFF] text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-50 dark:border-gray-600 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-bold">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-8">
        <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-1.5 border border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleAttachImage}
            className="p-2.5 text-gray-400 hover:text-[#E0AAFF] transition-colors active:scale-90"
          >
            <ImageIcon size={22} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-white placeholder:text-gray-400 px-2"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-[#E0AAFF] text-white rounded-2xl shadow-soft active:scale-95 transition-all"
          >
            <Send size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
