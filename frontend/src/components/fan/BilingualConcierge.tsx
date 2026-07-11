import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MessageCircle, Globe, Send, User, Bot, Mic, Loader2, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage, Preset } from '../../types';

import { languages, presets, simulatedResponses, customSimulatedAnswers } from '../../data/mockConcierge';

export default function BilingualConcierge() {
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your Bilingual Fan Concierge. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Update welcome message if language changes and chat is empty or just started
    if (messages.length <= 1) {
      const welcomeMap: Record<string, string> = {
        en: 'Hello! I am your Bilingual Fan Concierge. How can I help you today?',
        hi: 'नमस्ते! मैं आपका द्विभाषी प्रशंसक सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?',
        te: 'హలో! నేను మీ ద్విభాషా అభిమాని సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?',
        ta: 'வணக்கம்! நான் உங்கள் இருமொழி ரசிகர் உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
        bn: 'হ্যালো! আমি আপনার দ্বিভাষিক ফ্যান কনসিয়েজ। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?'
      };
      setMessages([{ role: 'assistant', content: welcomeMap[lang] || welcomeMap['en'] }]);
    }
  }, [lang, messages.length]);

  const speakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const localeMap: Record<string, string> = {
      en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', bn: 'bn-IN'
    };
    utterance.lang = localeMap[langCode] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handlePresetClick = (preset: Preset) => {
    const userQuery = (preset as unknown as Record<string, string>)[lang] || preset.en;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const resText = simulatedResponses[preset.id][lang] || simulatedResponses[preset.id]['en'];
      setMessages(prev => [...prev, { role: 'assistant', content: resText }]);
      // No voice for chat interactions
    }, 1200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    const userQuery = customInput.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setCustomInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const possibleAnswers = customSimulatedAnswers[lang] || customSimulatedAnswers['en'];
      const randomAnswer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomAnswer }]);
      // No voice for text chat
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Mock transcribed voice query
      const voiceQueries: Record<string, string> = {
        en: 'Where can I find the team store?',
        hi: 'मुझे टीम स्टोर कहाँ मिल सकता है?',
        te: 'నేను టీమ్ స్టోర్‌ను ఎక్కడ కనుగొనగలను?',
        ta: 'குழு கடையை நான் எங்கே காணலாம்?',
        bn: 'আমি দলের দোকান কোথায় পেতে পারি?'
      };
      const userQuery = voiceQueries[lang] || voiceQueries['en'];
      setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        // The 4th custom answer corresponds to the team store
        const answer = (customSimulatedAnswers[lang] || customSimulatedAnswers['en'])[3];
        setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        // Voice to Voice: Speak the answer because input was voice
        speakText(answer, lang);
      }, 1500);
    }, 2000);
  };

  return (
    <Card className="h-full border border-primary/20 bg-surfaceHighlight/10 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-primary">
          <Globe className="w-5 h-5" />
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Fan Copilot</CardTitle>
        </div>
        <div className="flex items-center gap-3">

          <select 
            className="bg-surface/50 border border-borderWhite/20 rounded-md text-xs p-1 outline-none focus:ring-1 focus:ring-primary"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select Language"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-0 overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-info/20 text-info'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-lg text-sm leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-primary/10 text-textPrimary border border-primary/20 rounded-tr-none' : 'bg-surfaceHighlight/50 text-textPrimary border border-borderWhite/10 rounded-tl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-info/20 text-info flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-lg bg-surfaceHighlight/50 text-textSecondary text-sm border border-borderWhite/10 rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Thinking & Translating...
                </div>
              </motion.div>
            )}
            {isRecording && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-error/20 text-error flex items-center justify-center shrink-0">
                  <User size={14} />
                </div>
                <div className="p-3 rounded-lg bg-surfaceHighlight/50 text-error text-sm border border-error/20 rounded-tr-none flex items-center gap-2">
                  <Radio size={14} className="animate-pulse" /> Listening...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className="whitespace-nowrap px-3 py-1.5 text-xs bg-surface border border-borderWhite/20 hover:border-primary/50 text-textSecondary hover:text-primary rounded-full transition-colors flex items-center gap-1.5"
            >
              <MessageCircle size={12} /> <span className="text-sm font-medium">{(preset as unknown as Record<string, string>)[lang] || preset.en}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleCustomSubmit} className="p-3 border-t border-borderWhite/20 bg-surface/30">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full bg-surface border border-borderWhite/20 rounded-lg py-2.5 px-4 pr-12 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
              aria-label="Custom Copilot Query"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                type="button"
                onClick={handleVoiceInput}
                className={`p-1.5 rounded-md transition-colors ${isRecording ? 'bg-error/20 text-error animate-pulse' : 'text-textSecondary hover:bg-surfaceHighlight hover:text-textPrimary'}`}
                disabled={isTyping || isRecording}
                aria-label="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                type="submit"
                className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                disabled={!customInput.trim() || isTyping || isRecording}
                aria-label="Send Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
