import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, HelpCircle, User } from "lucide-react";

interface AIConciergeProps {
  lang: "en" | "ar";
}

interface ChatMessage {
  id: number;
  sender: "user" | "concierge";
  text: string;
}

export default function AIConcierge({ lang }: AIConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "concierge",
      text: lang === "en"
        ? "Greetings, honored guest! I am Mousa and Sadeen's private concierge. It is my absolute pleasure to guide you with any inquiries regarding their wedding details. How may I assist you today?"
        : "أهلاً بك ضيفنا الكريم! أنا المساعد الذكي الخاص بحفل زفاف موسى وسدين. يسعدني جداً مساعدتك بخصوص أي استفسارات تتعلق بتفاصيل الحفل المبارك. كيف يمكنني خدمتك اليوم؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestions = lang === "en"
    ? [
        "What is the dress code?",
        "Where is the venue and is there parking?",
        "Can we bring children?",
        "What is the wedding schedule?"
      ]
    : [
        "ما هو اللباس الرسمي المعتمد؟",
        "أين تقع القاعة وهل يوجد مواقف سيارات؟",
        "هل يمكن اصطحاب الأطفال؟",
        "ما هو جدول وتوقيت الحفل؟"
      ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "concierge",
            text: data.reply
          }
        ]);
      } else {
        throw new Error("API call failed");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "concierge",
          text: lang === "en"
            ? "I am currently adjusting my tuxedo, but I can assure you the grand wedding is on Friday, July 17, 2026 at 8:00 PM at Grand Views. Please let me know how else I can serve you."
            : "أعتذر منك، أواجه صعوبة مؤقتة في الاتصال بالخادم، لكن يمكنني تأكيد أن حفل الزفاف المبارك يقام يوم الجمعة ١٧ تموز ٢٠٢٦ في تمام الساعة ٨ مساءً في مزرعة Grand Views طريق المطار."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Concierge Button */}
      <button
        id="btn-open-concierge"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-white/90 border border-border-neutral hover:border-gold/40 text-gold p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md hover:-translate-y-[2px] transition-all duration-300 flex items-center gap-2 focus:outline-none cursor-none"
        aria-label="Open Wedding AI Assistant"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/50 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
        <MessageSquare size={18} />
        <span className="text-[10px] font-mono uppercase tracking-wider pr-1 hidden sm:inline-block">
          {lang === "en" ? "AI Concierge" : "مساعد الزفاف الذكي"}
        </span>
      </button>

      {/* Concierge Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="concierge-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-900 z-50 pointer-events-auto"
            />

            {/* Sidebar panel */}
            <motion.div
              id="concierge-drawer"
              initial={{ x: lang === "en" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "en" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${
                lang === "en" ? "right-0" : "left-0"
              } w-full max-w-md bg-gradient-to-b from-ivory to-cream backdrop-blur-2xl border-l border-border-neutral z-50 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.03)]`}
            >
              {/* Header */}
              <div className="p-6 border-b border-border-neutral flex items-center justify-between bg-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center">
                    <Sparkles className="text-gold" size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-dark-neutral font-light font-semibold leading-none">
                      {lang === "en" ? "Mousa & Sadeen" : "موسى وسدين"}
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest text-gold uppercase mt-1 inline-block">
                      {lang === "en" ? "Private AI Concierge" : "المساعد الشخصي الذكي"}
                    </span>
                  </div>
                </div>
                <button
                  id="btn-close-concierge"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/45 text-stone-neutral hover:text-dark-neutral transition-all focus:outline-none cursor-none"
                  aria-label="Close Assistant"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Message Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isConcierge = msg.sender === "concierge";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        isConcierge ? "mr-auto" : "ml-auto flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          isConcierge
                            ? "bg-gold/5 border-gold/15 text-gold"
                            : "bg-white border border-border-neutral text-stone-neutral"
                        }`}
                      >
                        {isConcierge ? <Sparkles size={12} /> : <User size={12} />}
                      </div>
                      <div
                        className={`p-4 rounded-2xl font-body text-base md:text-lg leading-relaxed ${
                          isConcierge
                            ? "bg-white border border-border-neutral text-dark-neutral rounded-tl-none shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
                            : "bg-gold/15 border border-gold/30 text-dark-neutral rounded-tr-none shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Loading state animation */}
                {loading && (
                  <div className="flex gap-3 max-w-[85%] mr-auto">
                    <div className="w-8 h-8 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
                      <Sparkles size={12} />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-border-neutral rounded-tl-none shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center gap-1.5 py-3">
                      <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* suggestions list */}
              <div className="px-6 py-3 border-t border-border-neutral bg-white/20">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-neutral block mb-2 flex items-center gap-1">
                  <HelpCircle size={10} />
                  {lang === "en" ? "Suggested Questions" : "الأسئلة المقترحة"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug, idx) => (
                    <button
                      id={`btn-suggestion-${idx}`}
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      disabled={loading}
                      className="text-xs bg-white border border-border-neutral hover:border-gold/30 text-stone-neutral hover:text-gold px-3 py-1.5 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all duration-300 focus:outline-none disabled:opacity-50 cursor-none"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-border-neutral bg-white/40">
                <div className="flex gap-2">
                  <input
                    id="input-concierge-message"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    placeholder={
                      lang === "en"
                        ? "Ask Sadeen & Mousa's concierge..."
                        : "اسأل المساعد عن أي تفصيل بخصوص الزفاف..."
                    }
                    className="flex-1 bg-white border border-border-neutral focus:border-gold/40 rounded-xl px-4 py-3 text-dark-neutral placeholder-stone-neutral/50 focus:outline-none font-body text-base md:text-lg transition-colors duration-300"
                  />
                  <button
                    id="btn-send-concierge"
                    onClick={() => handleSendMessage(input)}
                    disabled={loading || !input.trim()}
                    className="p-3.5 bg-gold hover:bg-gold/90 text-white rounded-xl shadow-sm transition-colors duration-300 disabled:bg-stone-200 cursor-none"
                    aria-label="Send Message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <span className="text-[9px] font-mono text-center block text-stone-neutral/60 mt-3 uppercase tracking-wider">
                  {lang === "en" ? "Powered securely by Gemini AI" : "يعمل بأمان بواسطة الذكاء الاصطناعي من غوغل"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
