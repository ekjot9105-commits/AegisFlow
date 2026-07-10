import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Volume2, Globe, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
];

const presets = [
  { id: 'restroom', en: 'Where is the nearest restroom?', hi: 'शौचालय कहाँ है?', te: 'దగ్గరలో ఉన్న రెస్ట్‌రూమ్ ఎక్కడ ఉంది?', ta: 'அருகிலுள்ள கழிப்பறை எங்கே?', bn: 'কাছের শৌচাগার কোথায়?' },
  { id: 'gate', en: 'How do I reach Gate C?', hi: 'मैं गेट सी तक कैसे पहुँचूँ?', te: 'నేను గేట్ C కి ఎలా చేరుకోవాలి?', ta: 'நான் எப்படி கேட் சி-ஐ அடைவது?', bn: 'আমি কীভাবে গেট সিতে পৌঁছাব?' },
  { id: 'food', en: 'Show me the shortest food court wait time.', hi: 'सबसे कम प्रतीक्षा समय वाला फ़ूड कोर्ट दिखाएं।', te: 'తక్కువ నిరీక్షణ సమయం ఉన్న ఫుడ్ కోర్ట్ చూపించు.', ta: 'குறைந்த காத்திருப்பு நேரம் கொண்ட உணவு விடுதியைக் காட்டு.', bn: 'সবচেয়ে কম অপেক্ষার সময় সহ ফুড কোর্ট দেখান।' }
];

const simulatedResponses: Record<string, Record<string, string>> = {
  restroom: {
    en: 'The nearest open restroom is near Section 102 (3 min walk). Let me highlight the route on your map.',
    hi: 'निकटतम खुला शौचालय धारा 102 के पास है। मुझे आपके नक्शे पर मार्ग दिखाने दें।',
    te: 'సమీపంలోని ఓపెన్ రెస్ట్‌రూమ్ సెక్షన్ 102 సమీపంలో ఉంది. నేను మీ మ్యాప్‌లో మార్గాన్ని హైలైట్ చేస్తాను.',
    ta: 'அருகிலுள்ள திறந்த கழிப்பறை பிரிவு 102க்கு அருகில் உள்ளது. உங்கள் வரைபடத்தில் வழியை நான் காட்டுகிறேன்.',
    bn: 'নিকটতম খোলা শৌচাগারটি সেকশন 102 এর কাছে রয়েছে। আমাকে আপনার মানচিত্রে পথটি হাইলাইট করতে দিন।'
  },
  gate: {
    en: 'Gate C is located on the East Concourse. Proceed straight and follow the blue signs. ETA: 7 mins.',
    hi: 'गेट सी ईस्ट कॉन्कोर्स पर स्थित है। सीधे आगे बढ़ें और नीले संकेतों का पालन करें।',
    te: 'గేట్ సి ఈస్ట్ కాన్‌కోర్స్‌లో ఉంది. నేరుగా ముందుకు సాగి నీలి రంగు సంకేతాలను అనుసరించండి.',
    ta: 'கேட் சி கிழக்கு கான்கோர்ஸில் அமைந்துள்ளது. நேராக சென்று நீல நிற அடையாளங்களை பின்பற்றவும்.',
    bn: 'গেট সি পূর্ব কনকোর্সে অবস্থিত। সোজা এগিয়ে যান এবং নীল চিহ্নগুলো অনুসরণ করুন।'
  },
  food: {
    en: 'The Express Concessions near Gate A currently has only a 2-minute wait. Would you like me to place a mobile order?',
    hi: 'गेट ए के पास एक्सप्रेस फूड कोर्ट में अभी केवल 2 मिनट का इंतजार है। क्या आप ऑर्डर देना चाहेंगे?',
    te: 'గేట్ ఎ సమీపంలోని ఎక్స్‌ప్రెస్ ఫుడ్ కోర్ట్‌లో ప్రస్తుతం 2 నిమిషాల నిరీక్షణ మాత్రమే ఉంది. మీరు ఆర్డర్ చేయాలనుకుంటున్నారా?',
    ta: 'கேட் ஏ அருகில் உள்ள உணவு விடுதியில் தற்போது 2 நிமிடம் மட்டுமே காத்திருக்க வேண்டும்.',
    bn: 'গেট এ এর কাছে এক্সপ্রেস ফুড কোর্টে বর্তমানে মাত্র 2 মিনিটের অপেক্ষা। আপনি কি অর্ডার করতে চান?'
  }
};

const customSimulatedAnswers: Record<string, string[]> = {
  en: [
    "I can help with that. Based on your location, the best option is directly behind Section 102.",
    "That is a great question! I've marked the fastest route to that facility on your digital map.",
    "Currently, that area is experiencing high traffic. I suggest waiting 10 minutes or using the alternative at the North Gate.",
    "Yes, you can find exactly what you are looking for at the Team Store located near Gate B."
  ],
  hi: [
    "मैं इसमें आपकी मदद कर सकता हूँ। आपकी लोकेशन के आधार पर सबसे अच्छा विकल्प सेक्शन 102 के ठीक पीछे है।",
    "यह एक बढ़िया सवाल है! मैंने आपके डिजिटल मैप पर वहां का सबसे तेज़ रास्ता चिह्नित कर दिया है।",
    "अभी उस क्षेत्र में बहुत भीड़ है। मेरा सुझाव है कि आप 10 मिनट प्रतीक्षा करें या नॉर्थ गेट वाले विकल्प का उपयोग करें।",
    "हाँ, आप गेट बी के पास स्थित टीम स्टोर में वह सब पा सकते हैं जो आप ढूंढ रहे हैं।"
  ],
  te: [
    "నేను సహాయం చేయగలను. మీ స్థానం ఆధారంగా, ఉత్తమ ఎంపిక విభాగం 102 వెనుక ఉంది.",
    "అది మంచి ప్రశ్న! మీ మ్యాప్‌లో వేగవంతమైన మార్గాన్ని నేను గుర్తించాను.",
    "ప్రస్తుతం అక్కడ రద్దీగా ఉంది. గేట్ బి వద్ద ప్రత్యామ్నాయాన్ని ఉపయోగించండి.",
    "అవును, గేట్ బి సమీపంలోని టీమ్ స్టోర్‌లో మీకు కావాల్సింది లభిస్తుంది."
  ],
  ta: [
    "நான் உதவ முடியும். உங்கள் இடத்தின் அடிப்படையில், சிறந்த தேர்வு பிரிவு 102 க்கு பின்னால் உள்ளது.",
    "இது ஒரு நல்ல கேள்வி! உங்கள் வரைபடத்தில் விரைவான வழியைக் குறித்துள்ளேன்.",
    "தற்போது அங்கு கூட்டம் அதிகமாக உள்ளது. கேட் பி-யில் உள்ள மாற்று வழியை பயன்படுத்தவும்.",
    "ஆம், கேட் பி அருகில் உள்ள கடையில் நீங்கள் தேடுவதை காணலாம்."
  ],
  bn: [
    "আমি এতে সাহায্য করতে পারি। আপনার অবস্থানের উপর ভিত্তি করে, সেরা বিকল্পটি সেকশন 102 এর ঠিক পিছনে রয়েছে।",
    "এটি একটি দুর্দান্ত প্রশ্ন! আমি আপনার ডিজিটাল মানচিত্রে সেখানে যাওয়ার দ্রুততম পথটি চিহ্নিত করেছি।",
    "বর্তমানে ওই এলাকায় খুব ভিড়। আমি নর্থ গেটে বিকল্পটি ব্যবহার করার পরামর্শ দিচ্ছি।",
    "হ্যাঁ, আপনি গেট বি এর কাছে অবস্থিত টিম স্টোরে যা খুঁজছেন তা পেতে পারেন।"
  ]
};

export default function BilingualConcierge() {
  const [lang, setLang] = useState('en');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  const speakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Simple mapping to browser locales
    const localeMap: Record<string, string> = {
      en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', bn: 'bn-IN'
    };
    utterance.lang = localeMap[langCode] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handlePresetClick = (id: string) => {
    setActiveQuery(id);
    setResponse(null);
    setIsTyping(true);
    
    // Simulate AI thinking and voice synthesis
    setTimeout(() => {
      setIsTyping(false);
      const resText = simulatedResponses[id][lang] || simulatedResponses[id]['en'];
      setResponse(resText);
      speakText(resText, lang);
    }, 1200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    setActiveQuery('custom');
    setResponse(null);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const possibleAnswers = customSimulatedAnswers[lang] || customSimulatedAnswers['en'];
      const randomAnswer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
      setResponse(randomAnswer);
      speakText(randomAnswer, lang);
      setCustomInput('');
    }, 1500);
  };

  return (
    <Card className="h-full border border-primary/20 bg-surfaceHighlight/10 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-primary">
          <Globe className="w-5 h-5" />
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Bilingual Fan Concierge</CardTitle>
        </div>
        <select 
          className="bg-surface/50 border border-borderWhite/20 rounded-md text-sm p-1 outline-none focus:ring-1 focus:ring-primary"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Select Language"
        >
          {languages.map(l => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="text-xs text-textSecondary uppercase tracking-wide">
          Bilingual Voice Assistant Simulator
        </div>
        
        <div className="flex-1 flex flex-col gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset.id)}
              className={`text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${activeQuery === preset.id ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-surface/30 border-borderWhite/20 hover:border-primary/50'}`}
              aria-label={`Ask: ${preset.en}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{preset.en}</span>
                {lang !== 'en' && <span className="text-xs text-textSecondary mt-1">{(preset as any)[lang]}</span>}
              </div>
              <Volume2 className={`w-4 h-4 transition-colors ${activeQuery === preset.id ? 'text-primary' : 'text-textSecondary group-hover:text-primary'}`} />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {(isTyping || response) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-surfaceHighlight/30 rounded-xl border border-borderWhite/20 relative"
            >
              <Sparkles className="w-4 h-4 text-info absolute top-3 left-3" />
              <div className="pl-6 text-sm text-textPrimary leading-relaxed min-h-[40px]" aria-live="polite" aria-atomic="true">
                {isTyping ? (
                  <span className="flex items-center h-full text-textSecondary italic">
                    AI Concierge is thinking and translating...
                  </span>
                ) : (
                  <span>
                    <span className="font-bold text-info">Recommender suggestion: </span>
                    {response}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleCustomSubmit} className="mt-auto pt-4 border-t border-borderWhite/20 relative">
          <input
            type="text"
            placeholder="Ask Fan Copilot..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full bg-surface/50 border border-borderWhite/20 rounded-lg py-3 px-4 pr-12 text-sm focus:ring-2 focus:ring-primary outline-none"
            aria-label="Custom Copilot Query"
          />
          <button 
            type="submit"
            className="absolute right-2 top-[26px] p-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50"
            disabled={!customInput.trim() || isTyping}
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
