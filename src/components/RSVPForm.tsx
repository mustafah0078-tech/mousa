import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, Send, AlertCircle, Heart } from "lucide-react";

interface RSVPFormProps {
  lang: "en" | "ar";
}

export default function RSVPForm({ lang }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    guests: 1,
    phone: "",
    attendance: "accept", // "accept" or "decline"
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError(lang === "en" ? "Please enter your name." : "يرجى كتابة الاسم الكريم.");
      return;
    }
    if (!formData.phone.trim()) {
      setError(lang === "en" ? "Please provide a contact phone number." : "يرجى كتابة رقم الهاتف للتواصل.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          guests: formData.guests,
          phone: formData.phone,
          attendance: formData.attendance === "accept",
          notes: formData.notes
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          name: "",
          guests: 1,
          phone: "",
          attendance: "accept",
          notes: ""
        });
      } else {
        setError(result.error || (lang === "en" ? "A technical issue occurred. Please try again." : "حدث خطأ فني، يرجى المحاولة لاحقاً."));
      }
    } catch (err) {
      console.error(err);
      setError(lang === "en" ? "Unable to connect to the server." : "لا يمكن الاتصال بالخادم حالياً.");
    } finally {
      setLoading(false);
    }
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

        <AnimatePresence mode="wait">
          {!success ? (
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

              {/* Attendance option */}
              <div className="space-y-2">
                <span className="block text-xs font-mono uppercase tracking-widest text-stone-neutral mb-2">
                  {lang === "en" ? "Will you attend?" : "هل ستشرفنا بالحضور؟"}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="btn-attendance-accept"
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "accept" })}
                    className={`px-6 py-4 rounded-xl border font-body text-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                      formData.attendance === "accept"
                        ? "bg-gold/5 border-gold text-gold font-semibold shadow-sm"
                        : "bg-white/10 border-border-neutral text-stone-neutral hover:border-gold/20"
                    }`}
                  >
                    <span>{lang === "en" ? "Yes, I will attend" : "نعم، يشرفني الحضور"}</span>
                    <span className="text-xs font-sans opacity-70">
                      {lang === "en" ? "With Joy" : "بكل سرور وحب"}
                    </span>
                  </button>
                  <button
                    id="btn-attendance-decline"
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "decline" })}
                    className={`px-6 py-4 rounded-xl border font-body text-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                      formData.attendance === "decline"
                        ? "bg-stone-100 border-stone-300 text-stone-700 font-semibold"
                        : "bg-white/10 border-border-neutral text-stone-neutral hover:border-gold/20"
                    }`}
                  >
                    <span>{lang === "en" ? "Regretfully Decline" : "أعتذر عن الحضور"}</span>
                    <span className="text-xs font-sans opacity-70">
                      {lang === "en" ? "In Spirit" : "بقلوبنا ودعواتنا"}
                    </span>
                  </button>
                </div>
              </div>

              {formData.attendance === "accept" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guests dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="select-guests" className="block text-xs font-mono uppercase tracking-widest text-stone-neutral">
                      {lang === "en" ? "Number of Guests" : "عدد المرافقين"}
                    </label>
                    <select
                      id="select-guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full bg-white/20 border border-border-neutral focus:border-gold/50 rounded-xl px-4 py-3 text-dark-neutral focus:outline-none transition-all duration-300 font-body text-lg"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {lang === "en" ? (num === 1 ? "Guest" : "Guests") : (num === 1 ? "شخص واحد" : "أشخاص")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="input-phone" className="block text-xs font-mono uppercase tracking-widest text-stone-neutral">
                      {lang === "en" ? "Phone Number" : "رقم الهاتف للتواصل"}
                    </label>
                    <input
                      id="input-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="07xxxxxxxx"
                      className="w-full bg-white/20 border border-border-neutral focus:border-gold/50 rounded-xl px-4 py-3 text-dark-neutral placeholder-stone-400 focus:outline-none transition-all duration-300 font-sans text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Special Notes */}
              <div className="space-y-2">
                <label htmlFor="textarea-notes" className="block text-xs font-mono uppercase tracking-widest text-stone-neutral">
                  {lang === "en" ? "Elegant Note to the Couple" : "كلمة طيبة للعروسين"}
                </label>
                <textarea
                  id="textarea-notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={lang === "en" ? "Share warm words, wishes or special details..." : "اكتب تهنئة خاصة أو أي ملاحظات للترتيب..."}
                  className="w-full bg-white/20 border border-border-neutral focus:border-gold/50 rounded-xl px-4 py-3 text-dark-neutral placeholder-stone-400 focus:outline-none transition-all duration-300 font-body text-lg"
                />
              </div>

              {/* Submit Button */}
              <button
                id="btn-rsvp-submit"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full border border-gold text-gold hover:bg-gold hover:text-white bg-transparent text-xs font-mono uppercase tracking-[0.3em] disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-300 transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-3 cursor-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    {lang === "en" ? "Submitting elegantly..." : "يتم إرسال ردكم الأنيق..."}
                  </span>
                ) : (
                  <>
                    <span>{lang === "en" ? "Send Response" : "إرسال تأكيد الحضور"}</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center relative">
                <Check className="text-gold" size={24} />
                {/* Floating hearts */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  {[1, 2, 3].map((heart) => (
                    <motion.div
                      key={heart}
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -40, scale: 1.2, x: (heart - 2) * 15 }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: heart * 0.4 }}
                      className="absolute text-gold"
                    >
                      <Heart size={10} fill="#D4AF37" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-dark-neutral font-light">
                  {lang === "en" ? "Response Received" : "تم استلام ردكم ببالغ المحبة"}
                </h3>
                <p className="font-body text-taupe-neutral text-lg max-w-md mx-auto leading-relaxed">
                  {formData.attendance === "decline"
                    ? (lang === "en"
                        ? "Thank you for sharing your thoughts with us. Your love and wishes are deeply treasured."
                        : "نشكركم على كلماتكم الطيبة ومحبتكم. سنفتقد وجودكم الجسدي ولكن قلوبكم وأمنياتكم ستكون حاضرة معنا.")
                    : (lang === "en"
                        ? "We are absolutely overjoyed to share our special night with you! See you on July 17, 2026."
                        : "سعادتنا تضاعفت برغبتكم بمشاركتنا فرحتنا الكبرى! ننتظركم بشوق يوم الجمعة ١٧ تموز ٢٠٢٦.")}
                </p>
              </div>

              <button
                id="btn-rsvp-reset"
                onClick={() => setSuccess(false)}
                className="px-6 py-2 border border-gold/20 hover:border-gold/50 rounded-full text-gold font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 focus:outline-none bg-transparent"
              >
                {lang === "en" ? "Update response" : "تعديل الرد"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
