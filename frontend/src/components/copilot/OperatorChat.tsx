import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function OperatorChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Operations Copilot online. How can I assist you with stadium intelligence today?' }
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
    if (!input.trim()) return;
    
    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_dev_token_123'
        },
        body: JSON.stringify({ query: userQuery, history: messages })
      });
      
      const json = await res.json();
      if (json.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: json.data.response }]);
      } else {
        throw new Error(json.message);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Unable to reach AI services.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface/30 rounded-xl border border-primary/20 overflow-hidden">
      <div className="p-3 bg-surfaceHighlight/50 border-b border-primary/20 flex justify-between items-center">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <Bot size={16} /> Operator Copilot
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-lg text-sm leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-primary/10 text-textPrimary border border-primary/20 rounded-tr-none' : 'bg-surfaceHighlight text-textPrimary border border-borderWhite/10 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-3 rounded-lg bg-surfaceHighlight text-textSecondary text-sm border border-borderWhite/10 rounded-tl-none flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Processing query...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 bg-surfaceHighlight/50 border-t border-primary/20">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about operations, crowd risk, etc..."
            className="w-full bg-surface border border-borderWhite/20 rounded-lg pl-4 pr-10 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-primary hover:bg-primary/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
