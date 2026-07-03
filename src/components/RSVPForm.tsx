import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, AlertCircle, Heart } from "lucide-react";

interface RSVPFormProps {
  lang: "en" | "ar";
}

export default function RSVPForm({ lang }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    guests: "1",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError(lang === "en" ? "Please enter your name." : "يرجى كتابة الاسم الكريم.");
      return;
    }
    if (!formData.guests.trim()) {
      setError(lang === "en" ? "Please provide the number of guests." : "يرجى تحديد عدد الحضور.");
      return;
    }

    const message = `السلام عليكم ورحمة الله وبركاته.

وصلتنا دعوتكم الكريمة، وتشرفنا بها. بإذن الله سنكون حاضرين.

الاسم: ${formData.name.trim()}

عدد الحضور معي: ${formData.guests.trim()}

بارك الله لكم، وأتم عليكم الفرحة، وجمع بينكما على خير، ونبارك لكم مقدمًا.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "962795685728";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div id="rsvp-section" className="relative max-w-2xl mx-auto px-4 py-12">
      {/* Background glowing gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative bg-white/40 backdrop-blur-xl border border-border-neutral p-8 md:p-12 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all duration-500"
      >
        {/* Top elegant wedding rings visual */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 relative">
            <Heart size={14} className="text-gold animate-pulse" />
          </div>
        </div>

        <h2 className="font-serif text-3xl text-dark-neutral text-center tracking-wide mb-2 font-light">
          {lang === "en" ? "Kindly Reply" : "تأكيد الحضور"}
        </h2>
        <p className="font-body text-taupe-neutral text-center text-lg max-w-md mx-auto mb-8 leading-relaxed">
          {lang === "en"
            ? "We request the honor of your presence. Please let us know if you can share in our joy."
            : "نأمل بتشريفكم حفلنا الكريم وسعادتنا تكتمل بوجودكم. يرجى تأكيد الحضور للتنظيم والترتيب."}
        </p>

        <motion.form
          key="rsvp-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {/* Error box */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50/50 border border-red-200/40 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-sans"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="input-name" className="block text-xs font-mono uppercase tracking-widest text-stone-neutral">
              {lang === "en" ? "Full Name" : "الاسم الكريم"}
            </label>
            <input
              id="input-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={lang === "en" ? "Your full name" : "الاسم ثلاثي أو اللقب الكريم"}
              className="w-full bg-white/20 border border-border-neutral focus:border-gold/50 rounded-xl px-4 py-3 text-dark-neutral placeholder-stone-400 focus:outline-none transition-all duration-300 font-body text-lg shadow-sm"
            />
          </div>

          {/* Guests dropdown */}
          <div className="space-y-2">
            <label htmlFor="select-guests" className="block text-xs font-mono uppercase tracking-widest text-stone-neutral">
              {lang === "en" ? "Number of Guests" : "عدد الحضور"}
            </label>
            <input
              id="input-guests"
              type="number"
              required
              min="1"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              placeholder={lang === "en" ? "E.g., 2" : "أدخل عدد الحضور"}
              className="w-full bg-white/20 border border-border-neutral focus:border-gold/50 rounded-xl px-4 py-3 text-dark-neutral placeholder-stone-400 focus:outline-none transition-all duration-300 font-body text-lg shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            id="btn-rsvp-submit"
            type="submit"
            className="w-full py-4 rounded-full border border-gold text-gold hover:bg-gold hover:text-white bg-transparent text-xs font-mono uppercase tracking-[0.3em] transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-3 cursor-none"
          >
            <span>{lang === "en" ? "Send Response via WhatsApp" : "تأكيد الحضور"}</span>
            <Send size={12} />
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
